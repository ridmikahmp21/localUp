const Order = require("../models/Order");
const Cart = require("../models/Cart");
const Product = require("../models/Product");
const crypto = require("crypto");
const Review = require("../models/Review");

// Create a new order
exports.createOrder = async (req, res) => {
  try {
    const { customerDetails, shippingAddress } = req.body;

    const cart = await Cart.findOne({ user: req.user._id }).populate(
      "items.product"
    );

    if (!cart || cart.items.length === 0) {
      return res.status(400).json({ message: "Cart is empty" });
    }

    const subtotal = cart.items.reduce((total, item) => {
      return total + (item.product?.price || 0) * item.quantity;
    }, 0);

    const shippingCost = subtotal > 5000 ? 0 : 500;
    const totalAmount = subtotal + shippingCost;

    const order = new Order({
      orderId: `ORD_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
      user: req.user._id,
      items: cart.items.map((item) => ({
        product: item.product._id,
        quantity: item.quantity,
        price: item.product.price,
      })),
      totalAmount,
      shippingCost,
      status: "pending",
      customerDetails,
      shippingAddress: shippingAddress || customerDetails,
    });

    await order.save();
    res.status(201).json(order);
  } catch (error) {
    if (error.code === 11000) {
      return res.status(400).json({ message: "Order already exists" });
    }
    console.error("Create order error:", error);
    res.status(500).json({ message: "Failed to create order" });
  }
};

// Get user's orders
exports.getOrders = async (req, res) => {
  try {
    const orders = await Order.find({ user: req.user._id })
      .populate("items.product")
      .sort({ createdAt: -1 });
    res.json(orders);
  } catch (error) {
    console.error("Get orders error:", error);
    res.status(500).json({ message: "Failed to fetch orders" });
  }
};

// Get specific order
exports.getOrderById = async (req, res) => {
  try {
    const order = await Order.findOne({
      _id: req.params.id,
      user: req.user._id,
    }).populate("items.product");

    if (!order) {
      return res.status(404).json({ message: "Order not found" });
    }

    res.json(order);
  } catch (error) {
    if (error.name === "CastError") {
      return res.status(400).json({ message: "Invalid order ID" });
    }
    console.error("Get order error:", error);
    res.status(500).json({ message: "Failed to fetch order" });
  }
};

// Update order status (for admin/seller)
exports.updateOrderStatus = async (req, res) => {
  try {
    const { status } = req.body;
    const validStatuses = [
      "pending",
      "processing",
      "ready to ship",
      "shipped",
      "out of delivery",
      "delivered",
    ];
    if (!validStatuses.includes(status)) {
      return res.status(400).json({ message: "Invalid status" });
    }

    const order = await Order.findById(req.params.id);
    if (!order) {
      return res.status(404).json({ message: "Order not found" });
    }

    const statusOrder = {
      pending: 0,
      processing: 1,
      "ready to ship": 2,
      shipped: 3,
      "out of delivery": 4,
      delivered: 5,
    };
    const currentIndex = statusOrder[order.status];
    const newIndex = statusOrder[status];

    if (newIndex <= currentIndex) {
      return res
        .status(400)
        .json({ message: "Cannot move to a previous or same status" });
    }

    order.status = status;
    await order.save();

    res.json(order);
  } catch (error) {
    console.error("Update order error:", error);
    res.status(500).json({ message: "Failed to update order" });
  }
};

// Handle PayHere payment notification
exports.handlePaymentNotification = async (req, res) => {
  try {
    console.log("Received PayHere notification:", req.body);

    if (process.env.PAYHERE_MODE === "sandbox") {
      console.log("Running in sandbox mode - processing test payment");

      const { custom_1, status_code, payment_id, order_id } = req.body;
      const order = await Order.findById(custom_1);

      if (!order) {
        console.error("Order not found in test mode");
        return res.status(404).json({ error: "Order not found" });
      }

      if (parseInt(status_code) === 2) {
        order.paymentStatus = "paid";
        order.paymentId = payment_id || "TEST_" + Date.now();
        order.status = "processing";

        for (const item of order.items) {
          await Product.findByIdAndUpdate(item.product, {
            $inc: { quantity: -item.quantity },
          });
        }

        await Cart.findOneAndUpdate(
          { user: order.user },
          { $set: { items: [] } }
        );
        console.log(
          "Test payment completed successfully for order:",
          order.orderId
        );
      } else if (parseInt(status_code) === -1 || parseInt(status_code) === -2) {
        order.paymentStatus = "failed";
        console.log("Test payment failed for order:", order.orderId);
      }

      await order.save();
      return res.status(200).send("OK");
    }

    const {
      merchant_id,
      order_id,
      payment_id,
      payhere_amount,
      payhere_currency,
      status_code,
      md5sig,
      custom_1,
    } = req.body;

    if (merchant_id !== process.env.PAYHERE_MERCHANT_ID) {
      console.error("Invalid merchant ID:", merchant_id);
      return res.status(400).json({ error: "Invalid merchant" });
    }

    const secret = process.env.PAYHERE_MERCHANT_SECRET;
    const localMd5 = crypto
      .createHash("md5")
      .update(
        merchant_id +
          order_id +
          payhere_amount +
          payhere_currency +
          status_code +
          crypto.createHash("md5").update(secret).digest("hex").toUpperCase()
      )
      .digest("hex")
      .toUpperCase();

    if (localMd5 !== md5sig) {
      console.error("MD5 signature mismatch");
      return res.status(400).json({ error: "Invalid signature" });
    }

    const order = await Order.findById(custom_1);
    if (!order) {
      console.error("Order not found:", custom_1);
      return res.status(404).json({ error: "Order not found" });
    }

    console.log("Updating order status for:", order.orderId);
    console.log("Payment status code:", status_code);

    switch (parseInt(status_code)) {
      case 2:
        order.paymentStatus = "paid";
        order.paymentId = payment_id;
        order.status = "processing";

        for (const item of order.items) {
          await Product.findByIdAndUpdate(item.product, {
            $inc: { quantity: -item.quantity },
          });
        }

        await Cart.findOneAndUpdate(
          { user: order.user },
          { $set: { items: [] } }
        );
        console.log("Payment completed successfully");
        break;

      case 0:
        order.paymentStatus = "pending";
        console.log("Payment pending");
        break;

      case -1:
        order.paymentStatus = "cancelled";
        order.status = "cancelled";
        console.log("Payment cancelled");
        break;

      case -2:
        order.paymentStatus = "failed";
        console.log("Payment failed");
        break;

      case -3:
        order.paymentStatus = "refunded";
        console.log("Payment refunded (chargeback)");
        break;

      default:
        console.log("Unknown status code:", status_code);
        break;
    }

    await order.save();
    console.log("Order updated successfully");
    res.status(200).send("OK");
  } catch (error) {
    console.error("Payment notification error:", error);
    res.status(500).json({ error: "Internal server error" });
  }
};

// Mock payment endpoint for development
exports.mockPayment = async (req, res) => {
  try {
    const { status } = req.body;
    const order = await Order.findById(req.params.id);

    if (!order) {
      return res.status(404).json({ message: "Order not found" });
    }

    if (!order.user.equals(req.user._id)) {
      return res.status(403).json({ message: "Not authorized for this order" });
    }

    if (status === "success") {
      for (const item of order.items) {
        const product = await Product.findById(item.product);
        if (!product) {
          return res
            .status(404)
            .json({ message: `Product ${item.product} not found` });
        }
        if (product.quantity < item.quantity) {
          return res.status(400).json({
            message: `Insufficient stock for ${product.name}. Available: ${product.quantity}`,
          });
        }
      }

      order.paymentStatus = "paid";
      order.status = "processing";
      order.paymentId = "MOCK_PAYMENT_" + Date.now();

      for (const item of order.items) {
        await Product.findByIdAndUpdate(item.product, {
          $inc: { quantity: -item.quantity },
        });
      }

      await Cart.findOneAndUpdate(
        { user: order.user },
        { $set: { items: [] } }
      );

      console.log(
        "Mock payment completed successfully for order:",
        order.orderId
      );
    } else {
      order.paymentStatus = "failed";
      console.log("Mock payment failed for order:", order.orderId);
    }

    await order.save();
    res.json({ message: "Mock payment processed", order });
  } catch (error) {
    console.error("Mock payment error:", error);
    res.status(500).json({ message: "Error processing mock payment" });
  }
};

// endpoint for mock create + pay
exports.mockCreateAndPay = async (req, res) => {
  try {
    const { customerDetails, shippingAddress } = req.body;

    const cart = await Cart.findOne({ user: req.user._id }).populate(
      "items.product"
    );

    if (!cart || cart.items.length === 0) {
      return res.status(400).json({ message: "Cart is empty" });
    }

    for (const item of cart.items) {
      if (item.product.quantity < item.quantity) {
        return res.status(400).json({
          message: `Insufficient stock for ${item.product.name}. Available: ${item.product.quantity}`,
        });
      }
    }

    const subtotal = cart.items.reduce(
      (total, item) => total + (item.product?.price || 0) * item.quantity,
      0
    );
    const shippingCost = subtotal > 5000 ? 0 : 500;
    const totalAmount = subtotal + shippingCost;

    const order = new Order({
      orderId: `ORD_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
      user: req.user._id,
      items: cart.items.map((item) => ({
        product: item.product._id,
        quantity: item.quantity,
        price: item.product.price,
      })),
      totalAmount,
      shippingCost,
      status: "processing",
      paymentStatus: "paid",
      paymentId: "MOCK_" + Date.now(),
      customerDetails,
      shippingAddress: shippingAddress || customerDetails,
    });

    await order.save();

    for (const item of order.items) {
      await Product.findByIdAndUpdate(item.product, {
        $inc: { quantity: -item.quantity },
      });
    }

    await Cart.findOneAndUpdate({ user: order.user }, { $set: { items: [] } });

    console.log("Mock order created and paid successfully:", order.orderId);
    res.status(201).json(order);
  } catch (error) {
    if (error.code === 11000) {
      return res.status(400).json({ message: "Order already exists" });
    }
    console.error("Mock create and pay error:", error);
    res.status(500).json({ message: "Failed to process mock order" });
  }
};

// Get all orders (for seller)
exports.getAllOrders = async (req, res) => {
  try {
    const orders = await Order.find()
      .populate("user", "name")
      .populate("items.product", "name category price")
      .sort({ createdAt: -1 });
    res.json(orders);
  } catch (error) {
    console.error("Get all orders error:", error);
    res.status(500).json({ message: "Failed to fetch orders" });
  }
};

// Create a review for an order item
exports.createReview = async (req, res) => {
  try {
    const { orderItemId, rating, comment } = req.body;

    if (!orderItemId || !rating || !comment) {
      return res
        .status(400)
        .json({ message: "Missing required review fields" });
    }

    if (rating < 1 || rating > 5) {
      return res
        .status(400)
        .json({ message: "Rating must be between 1 and 5" });
    }

    const order = await Order.findOne({
      "items._id": orderItemId,
      user: req.user._id,
    }).populate("items.product");
    if (!order) {
      return res
        .status(404)
        .json({ message: "Order not found or not authorized" });
    }

    const item = order.items.find(
      (item) => item._id.toString() === orderItemId
    );
    if (!item || order.status !== "delivered") {
      return res.status(400).json({ message: "Cannot review this item" });
    }

    const review = new Review({
      user: req.user._id,
      username: req.user.username,
      orderItem: orderItemId,
      product: item.product._id,
      rating,
      comment,
    });
    await review.save();

    const productUpdate = await Product.findByIdAndUpdate(
      item.product._id,
      { $push: { reviews: review._id } },
      { new: true, runValidators: true }
    );
    if (!productUpdate) {
      console.error(
        "Failed to update product with review ID:",
        item.product._id
      );
      return res
        .status(500)
        .json({ message: "Failed to update product with review" });
    }
    console.log("Product updated with review ID:", review._id);

    res.status(201).json(review);
  } catch (error) {
    console.error("Create review error:", error);
    res.status(500).json({ message: "Failed to create review" });
  }
};

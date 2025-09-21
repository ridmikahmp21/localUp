const Cart = require("../models/Cart");
const Product = require("../models/Product");
const mergeDuplicateCarts = require("../utils/mergeDuplicateCarts");

exports.getCart = async (req, res) => {
  try {
    const cart = await Cart.findOne({ user: req.user._id }).populate(
      "items.product"
    );

    if (!cart || cart.items.length === 0) {
      return res.json({ items: [] });
    }

    const formattedItems = cart.items.map((item) => ({
      product: {
        _id: item.product?._id,
        name: item.product?.name,
        image: item.product?.image,
        price: item.product?.price,
        description: item.product?.description,
      },
      quantity: item.quantity,
    }));

    res.json({ items: formattedItems });
  } catch (err) {
    console.error("Cart fetch error:", err);
    res.status(500).json({ message: "Failed to fetch cart items." });
  }
};

exports.addToCart = async (req, res) => {
  const { productId, quantity } = req.body;

  if (!req.user || !req.user._id) {
    console.error("Add to cart failed: Missing authenticated user");
    return res
      .status(401)
      .json({
        message: "Unauthorized: Please log in to add items to your cart.",
      });
  }

  console.log("Authenticated user ID:", req.user._id);

  try {
    const product = await Product.findById(productId);
    if (!product) return res.status(404).json({ message: "Product not found" });

    await mergeDuplicateCarts(req.user._id);

    let cart = await Cart.findOne({ user: req.user._id });
    if (!cart) cart = new Cart({ user: req.user._id, items: [] });

    const existingItem = cart.items.find((item) =>
      item.product.equals(productId)
    );

    if (existingItem) {
      existingItem.quantity += quantity;
    } else {
      cart.items.push({ product: productId, quantity });
    }

    await cart.save();
    res.json(cart);
  } catch (err) {
    console.error("Add to cart error:", err);
    res.status(500).json({ message: "Failed to add item to cart." });
  }
};

exports.updateQuantity = async (req, res) => {
  const { quantity } = req.body;

  try {
    const cart = await Cart.findOne({ user: req.user._id });
    if (!cart) return res.status(404).json({ message: "Cart not found" });

    const item = cart.items.find((i) => i.product.equals(req.params.productId));
    if (!item) return res.status(404).json({ message: "Item not in cart" });

    item.quantity = quantity;
    await cart.save();
    res.json(cart);
  } catch (err) {
    console.error("Update quantity error:", err);
    res.status(500).json({ message: "Failed to update quantity." });
  }
};

exports.removeFromCart = async (req, res) => {
  try {
    const cart = await Cart.findOne({ user: req.user._id });
    if (!cart) return res.status(404).json({ message: "Cart not found" });

    cart.items = cart.items.filter(
      (i) => !i.product.equals(req.params.productId)
    );
    await cart.save();
    res.json(cart);
  } catch (err) {
    console.error("Remove from cart error:", err);
    res.status(500).json({ message: "Failed to remove item." });
  }
};

exports.clearCart = async (req, res) => {
  try {
    const cart = await Cart.findOne({ user: req.user._id });
    if (!cart) return res.status(404).json({ message: "Cart not found" });

    cart.items = [];
    await cart.save();
    res.json({ message: "Cart cleared" });
  } catch (err) {
    console.error("Clear cart error:", err);
    res.status(500).json({ message: "Failed to clear cart." });
  }
};

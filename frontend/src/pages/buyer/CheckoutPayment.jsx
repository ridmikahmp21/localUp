import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useCart } from "../../context/CartContext";
import HelpCenter from "../../components/HelpCenter";
import axios from "axios";
import { toast } from "react-toastify";

const CheckoutPayment = () => {
  const { items, getCartTotal, clearCart } = useCart();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [userData, setUserData] = useState(null);
  const [useMockPayment, setUseMockPayment] = useState(false);
  const [paymentInitiated, setPaymentInitiated] = useState(false); // New state to track payment start

  const [customerDetails, setCustomerDetails] = useState({
    firstName: "",
    lastName: "",
    email: "",
    phone: "",
    address: "",
  });

  const [shippingAddress, setShippingAddress] = useState({
    firstName: "",
    lastName: "",
    address: "",
  });

  const [sameAsBilling, setSameAsBilling] = useState(true);

  // Calculate totals
  const subtotal = getCartTotal();
  const shipping = subtotal >= 5000 ? 0 : 500;
  const total = subtotal + shipping;

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const token = localStorage.getItem("token");
        const response = await axios.get("http://localhost:5000/api/auth/me", {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        setUserData(response.data);

        // Pre-fill form with user data
        const nameParts = response.data.name.split(" ");
        const firstName = nameParts[0];
        const lastName = nameParts.slice(1).join(" ");

        setCustomerDetails({
          firstName: firstName || "",
          lastName: lastName || "",
          email: response.data.email || "",
          phone: response.data.phone || "",
          address: response.data.address || "",
        });

        setShippingAddress({
          firstName: firstName || "",
          lastName: lastName || "",
          address: response.data.address || "",
        });
      } catch (error) {
        console.error("Error fetching user data:", error);
        toast.error("Failed to load user data");
      }
    };

    fetchUserData();
  }, []);

  const handleInputChange = (e, section) => {
    const { name, value } = e.target;

    if (section === "customer") {
      setCustomerDetails((prev) => ({
        ...prev,
        [name]: value,
      }));

      if (
        sameAsBilling &&
        (name === "firstName" || name === "lastName" || name === "address")
      ) {
        setShippingAddress((prev) => ({
          ...prev,
          [name]: value,
        }));
      }
    } else {
      setShippingAddress((prev) => ({
        ...prev,
        [name]: value,
      }));
    }
  };

  const handleSameAsBillingChange = (e) => {
    const isChecked = e.target.checked;
    setSameAsBilling(isChecked);

    if (isChecked) {
      setShippingAddress({
        firstName: customerDetails.firstName,
        lastName: customerDetails.lastName,
        address: customerDetails.address,
      });
    }
  };

  const loadPayHereScript = () => {
    return new Promise((resolve, reject) => {
      if (window.payhere) {
        resolve();
        return;
      }

      const script = document.createElement("script");
      script.src = "https://www.payhere.lk/lib/payhere.js";
      script.onload = () => resolve();
      script.onerror = () => reject(new Error("Failed to load PayHere script"));
      document.head.appendChild(script);
    });
  };

  const initiatePayHerePayment = async (order) => {
    try {
      console.log("Loading PayHere script...");
      await loadPayHereScript();

      console.log("Setting up PayHere callbacks...");
      window.payhere.onCompleted = function onCompleted(orderId) {
        console.log("Payment completed. Order ID:" + orderId);
        clearCart();
        navigate(`/checkout/success?order_id=${orderId}`);
      };

      window.payhere.onError = function onError(error) {
        console.log("PayHere Error:" + error);
        setLoading(false);
        setPaymentInitiated(false); 
        toast.error("Payment failed. Please try again.");
      };

      window.payhere.onDismissed = function onDismissed() {
        console.log("Payment dismissed by user");
        setLoading(false);
        setPaymentInitiated(false); 
      };

      // Use test credentials while account is pending
      const payment = {
        sandbox: true,
        merchant_id: "1217925",
        return_url: `${window.location.origin}/checkout/success`,
        cancel_url: `${window.location.origin}/checkout`,
        notify_url: `http://localhost:5000/api/orders/payhere/notify`,
        order_id: order.orderId,
        items: order.items
          .map((item) => item.product?.name || "Product")
          .join(", "),
        amount: order.totalAmount.toFixed(2),
        currency: "LKR",
        first_name: customerDetails.firstName,
        last_name: customerDetails.lastName,
        email: customerDetails.email,
        phone: customerDetails.phone,
        address: customerDetails.address,
        city: "Colombo",
        country: "Sri Lanka",
        delivery_address: shippingAddress.address,
        delivery_city: "Colombo",
        delivery_country: "Sri Lanka",
        custom_1: order._id.toString(),
      };

      console.log("Starting PayHere payment with test credentials");
      window.payhere.startPayment(payment);
    } catch (error) {
      console.error("PayHere initialization error:", error);
      setLoading(false);
      setPaymentInitiated(false);
      throw error;
    }
  };

  const initiateMockPayment = async (details) => {
    setLoading(true);
    toast.info("Processing mock payment...");

    try {
      const response = await axios.post(
        "http://localhost:5000/api/orders/mock-create",
        details,
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        }
      );

      const order = response.data;
      clearCart();
      toast.success("Mock payment completed successfully!");
      navigate(`/checkout/success?order_id=${order.orderId}`);
    } catch (error) {
      console.error(
        "Mock payment detailed error:",
        error.response?.data || error.message
      );
      toast.error(
        error.response?.data?.message ||
          "Mock payment failed. Check console for details."
      );
    } finally {
      setLoading(false);
      setPaymentInitiated(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (paymentInitiated || loading) return; 
    setLoading(true);
    setPaymentInitiated(true);

    const requiredFields = [
      "firstName",
      "lastName",
      "email",
      "phone",
      "address",
    ];
    const missingFields = requiredFields.filter(
      (field) => !customerDetails[field]
    );

    if (missingFields.length > 0) {
      toast.error(
        `Please fill in all required fields: ${missingFields.join(", ")}`
      );
      setLoading(false);
      setPaymentInitiated(false);
      return;
    }

    const details = {
      customerDetails,
      shippingAddress: sameAsBilling ? customerDetails : shippingAddress,
    };

    try {
      if (useMockPayment) {
        await initiateMockPayment(details);
      } else {
        const orderResponse = await axios.post(
          "http://localhost:5000/api/orders",
          details,
          {
            headers: {
              Authorization: `Bearer ${localStorage.getItem("token")}`,
            },
          }
        );

        const order = orderResponse.data;
        console.log("Order created:", order);
        await initiatePayHerePayment(order);
      }
    } catch (error) {
      console.error("Checkout error:", error);
      console.error("Error response:", error.response?.data);
      setLoading(false);
      setPaymentInitiated(false);

      if (error.response?.status === 401) {
        toast.error("Session expired. Please login again.");
        navigate("/signIn");
      } else if (error.response?.status === 400) {
        toast.error(error.response?.data?.message || "Invalid order data");
      } else {
        toast.error(
          error.response?.data?.message ||
            "Checkout failed. Please check console for details"
        );
      }
    }
  };

  const handleCancel = () => {
    navigate("/cart");
  };

  if (items.length === 0) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">
            Your cart is empty
          </h2>
          <button
            onClick={() => navigate("/home")}
            className="px-6 py-3 bg-gray-800 text-white rounded-lg hover:bg-gray-900"
          >
            Continue Shopping
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8 px-4">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-3xl font-bold text-gray-800 mb-6">Checkout</h1>

        <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4 mb-6">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="font-semibold text-yellow-800">Payment Mode</h3>
              <p className="text-sm text-yellow-700">
                {useMockPayment
                  ? "Using mock payment for testing"
                  : "Using PayHere payment gateway"}
              </p>
            </div>
            <label className="relative inline-flex items-center cursor-pointer">
              <input
                type="checkbox"
                checked={useMockPayment}
                onChange={() => {
                  if (!paymentInitiated) setUseMockPayment(!useMockPayment); // Only allow change if payment not initiated
                }}
                className="sr-only peer"
                disabled={paymentInitiated}
              />
              <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
              <span className="ml-3 text-sm font-medium text-gray-900">
                {useMockPayment ? "Mock Payment" : "PayHere"}
              </span>
            </label>
          </div>
          {useMockPayment && (
            <p className="text-xs text-yellow-600 mt-2">
              Note: Using mock payment for testing while PayHere account is
              pending activation
            </p>
          )}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          <div className="bg-white rounded-lg shadow-md p-6">
            <h2 className="text-xl font-semibold text-gray-800 mb-4">
              Customer Details
            </h2>
            <form onSubmit={handleSubmit}>
              <div className="grid grid-cols-2 gap-4 mb-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    First Name *
                  </label>
                  <input
                    type="text"
                    name="firstName"
                    value={customerDetails.firstName}
                    onChange={(e) => handleInputChange(e, "customer")}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-gray-600 focus:border-transparent"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Last Name *
                  </label>
                  <input
                    type="text"
                    name="lastName"
                    value={customerDetails.lastName}
                    onChange={(e) => handleInputChange(e, "customer")}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-gray-600 focus:border-transparent"
                    required
                  />
                </div>
              </div>

              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Email *
                </label>
                <input
                  type="email"
                  name="email"
                  value={customerDetails.email}
                  onChange={(e) => handleInputChange(e, "customer")}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-gray-600 focus:border-transparent"
                  required
                />
              </div>

              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Phone *
                </label>
                <input
                  type="tel"
                  name="phone"
                  value={customerDetails.phone}
                  onChange={(e) => handleInputChange(e, "customer")}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-gray-600 focus:border-transparent"
                  required
                />
              </div>

              <div className="mb-6">
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Address *
                </label>
                <input
                  type="text"
                  name="address"
                  value={customerDetails.address}
                  onChange={(e) => handleInputChange(e, "customer")}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-gray-600 focus:border-transparent"
                  required
                />
              </div>

              <div className="mb-6">
                <label className="flex items-center">
                  <input
                    type="checkbox"
                    checked={sameAsBilling}
                    onChange={handleSameAsBillingChange}
                    className="h-4 w-4 text-gray-600 focus:ring-gray-500 border-gray-300 rounded"
                  />
                  <span className="ml-2 text-sm text-gray-700">
                    Same as billing address
                  </span>
                </label>
              </div>
            </form>
          </div>

          {!sameAsBilling && (
            <div className="bg-white rounded-lg shadow-md p-6">
              <h2 className="text-xl font-semibold text-gray-800 mb-4">
                Shipping Address
              </h2>
              <div className="grid grid-cols-2 gap-4 mb-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    First Name *
                  </label>
                  <input
                    type="text"
                    name="firstName"
                    value={shippingAddress.firstName}
                    onChange={(e) => handleInputChange(e, "shipping")}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-gray-600 focus:border-transparent"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Last Name *
                  </label>
                  <input
                    type="text"
                    name="lastName"
                    value={shippingAddress.lastName}
                    onChange={(e) => handleInputChange(e, "shipping")}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-gray-600 focus:border-transparent"
                    required
                  />
                </div>
              </div>

              <div className="mb-6">
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Address *
                </label>
                <input
                  type="text"
                  name="address"
                  value={shippingAddress.address}
                  onChange={(e) => handleInputChange(e, "shipping")}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-gray-600 focus:border-transparent"
                  required
                />
              </div>
            </div>
          )}

          {/* Order Summary */}
          <div className="bg-white rounded-lg shadow-md p-6 lg:col-span-2">
            <h2 className="text-xl font-semibold text-gray-800 mb-4">
              Order Summary
            </h2>
            <div className="space-y-2">
              <div className="flex justify-between text-gray-700">
                <span>Subtotal</span>
                <span>LKR {subtotal.toFixed(2)}</span>
              </div>
              <div className="flex justify-between text-gray-700">
                <span>Shipping</span>
                <span>LKR {shipping.toFixed(2)}</span>
              </div>
              <div className="flex justify-between font-semibold text-gray-900">
                <span>Total</span>
                <span>LKR {total.toFixed(2)}</span>
              </div>
            </div>

            <div className="mt-6 space-x-4">
              <button
                type="button"
                onClick={handleCancel}
                className="px-6 py-3 bg-gray-200 text-gray-800 rounded-lg hover:bg-gray-300"
                disabled={loading}
              >
                Cancel
              </button>
              <button
                type="submit"
                onClick={handleSubmit}
                className="px-6 py-3 bg-gray-800 text-white rounded-lg hover:bg-gray-900 disabled:bg-gray-400"
                disabled={loading || paymentInitiated}
              >
                {loading ? "Processing..." : "Pay Now"}
              </button>
            </div>
          </div>
        </div>
      </div>
      <HelpCenter />
    </div>
  );
};

export default CheckoutPayment;

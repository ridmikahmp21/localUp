import React, { useState, useEffect } from "react";
import { useLocation, Link } from "react-router-dom";
import axios from "axios";
import Navbar from "../../components/navbarBuyer/Navbar";

const CheckoutSuccess = () => {
  const [order, setOrder] = useState(null);
  const [loading, setLoading] = useState(true);
  const location = useLocation();

  const searchParams = new URLSearchParams(location.search);
  const orderId = searchParams.get("order_id");

  useEffect(() => {
    const fetchOrderDetails = async () => {
      try {
        if (orderId) {
          const response = await axios.get(`/api/orders/${orderId}`, {
            headers: {
              Authorization: `Bearer ${localStorage.getItem("token")}`,
            },
          });
          setOrder(response.data);
        }
      } catch (error) {
        console.error("Error fetching order details:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchOrderDetails();
  }, [orderId]);

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex flex-col">
        <Navbar />
        <div className="flex-1 flex items-center justify-center">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-gray-900"></div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      <Navbar />

      <div className="flex-1 py-8 px-4 flex items-center justify-center">
        <div className="max-w-md w-full">
          {/* Success Card */}
          <div className="bg-white rounded-xl shadow-sm p-8 border border-gray-100">
            <div className="text-center mb-8">
              <div className="w-20 h-20 bg-green-50 rounded-full flex items-center justify-center mx-auto mb-4">
                <svg
                  className="w-10 h-10 text-green-500"
                  fill="currentColor"
                  viewBox="0 0 20 20"
                >
                  <path
                    fillRule="evenodd"
                    d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                    clipRule="evenodd"
                  />
                </svg>
              </div>

              <h1 className="text-2xl font-bold text-gray-900 mb-2">
                Payment Successful!
              </h1>
              <p className="text-gray-600 text-sm">
                Thank you for your purchase. Your order has been confirmed.
              </p>
            </div>

            {order && (
              <div className="mb-6">
                <div className="flex justify-between items-center mb-4">
                  <h2 className="text-lg font-semibold text-gray-900">
                    Order Details
                  </h2>
                  <span className="text-xs font-medium bg-green-100 text-green-800 px-2 py-1 rounded-full">
                    {order.status.charAt(0).toUpperCase() +
                      order.status.slice(1)}
                  </span>
                </div>

                <div className="space-y-3">
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-600">Order ID</span>
                    <span className="font-medium text-gray-900">
                      {order.orderId}
                    </span>
                  </div>

                  <div className="flex justify-between text-sm">
                    <span className="text-gray-600">Date</span>
                    <span className="font-medium text-gray-900">
                      {new Date(order.createdAt).toLocaleDateString("en-US", {
                        year: "numeric",
                        month: "short",
                        day: "numeric",
                      })}
                    </span>
                  </div>

                  <div className="flex justify-between text-sm">
                    <span className="text-gray-600">Items</span>
                    <span className="font-medium text-gray-900">
                      {order.items.reduce(
                        (total, item) => total + item.quantity,
                        0
                      )}
                    </span>
                  </div>

                  <div className="pt-3 border-t border-gray-100">
                    <div className="flex justify-between text-sm mb-1">
                      <span className="text-gray-600">Subtotal</span>
                      <span className="font-medium text-gray-900">
                        LKR{" "}
                        {(order.totalAmount - order.shippingCost).toFixed(2)}
                      </span>
                    </div>

                    <div className="flex justify-between text-sm mb-1">
                      <span className="text-gray-600">Shipping</span>
                      <span className="font-medium">
                        {order.shippingCost === 0 ? (
                          <span className="text-green-600">FREE</span>
                        ) : (
                          <span className="text-gray-900">
                            LKR {order.shippingCost.toFixed(2)}
                          </span>
                        )}
                      </span>
                    </div>

                    <div className="flex justify-between mt-2 pt-2 border-t border-gray-100">
                      <span className="font-semibold text-gray-900">Total</span>
                      <span className="font-bold text-blue-600">
                        LKR {order.totalAmount.toFixed(2)}
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            )}

            <div className="bg-blue-50 rounded-lg p-4 mb-6 text-center">
              <p className="text-sm text-gray-700">
                A confirmation email has been sent to your email address.
              </p>
            </div>

            <div className="space-y-3">
              <Link
                to="/orderBuyer"
                className="block w-full px-4 py-3 bg-gray-800 text-white text-center rounded-lg hover:bg-black transition-colors text-sm font-medium"
              >
                View My Orders
              </Link>
              <Link
                to="/home"
                className="block w-full px-4 py-2.5 border border-gray-300 text-gray-700 text-center rounded-lg hover:bg-gray-50 transition-colors text-sm"
              >
                Continue Shopping
              </Link>
            </div>
          </div>

          <div className="mt-6 text-center">
            <p className="text-xs text-gray-500">
              Need help?{" "}
              <a href="/contact" className="text-blue-600 hover:underline">
                Contact our support team
              </a>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CheckoutSuccess;

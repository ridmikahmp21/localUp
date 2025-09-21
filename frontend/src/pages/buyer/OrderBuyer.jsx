import React, { useState, useEffect } from "react";
import axios from "axios";
import { Link } from "react-router-dom";
import { toast } from "react-toastify";
import Navbar from "../../components/navbarBuyer/Navbar";
import HelpCenter from "../../components/HelpCenter";

const OrderBuyer = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState("all");
  const [review, setReview] = useState({
    orderItemId: "",
    rating: 1,
    comment: "",
  });
  const [activeReviewForm, setActiveReviewForm] = useState(null);

  useEffect(() => {
    fetchOrders();
  }, []);

  const fetchOrders = async () => {
    try {
      const token = localStorage.getItem("token");
      if (!token) {
        toast.error("Please log in to view your orders");
        return;
      }
      const response = await axios.get("http://localhost:5000/api/orders", {
        headers: { Authorization: `Bearer ${token}` },
      });
      setOrders(response.data);
    } catch (error) {
      console.error(
        "Error fetching orders:",
        error.response?.data || error.message
      );
      toast.error(
        error.response?.data?.message ||
          "Failed to load orders. Please try again later."
      );
    } finally {
      setLoading(false);
    }
  };

  const handleReviewChange = (e) => {
    setReview({ ...review, [e.target.name]: e.target.value });
  };

  const submitReview = async (e, orderItemId) => {
    e.preventDefault();
    try {
      const token = localStorage.getItem("token");
      if (!token) {
        toast.error("Please log in to submit a review");
        return;
      }
      const response = await axios.post(
        "http://localhost:5000/api/orders/reviews",
        { ...review, orderItemId },
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      toast.success("Review submitted successfully!");
      setReview({ orderItemId: "", rating: 1, comment: "" });
      setActiveReviewForm(null);
      fetchOrders();
    } catch (error) {
      console.error("Error submitting review:", error);
      toast.error("Failed to submit review. Please try again.");
    }
  };

  const filteredOrders = orders.filter((order) => {
    if (filter === "all") return true;
    return order.status === filter;
  });

  const getStatusDisplay = (status) => {
    switch (status) {
      case "pending":
        return "Order placed, awaiting confirmation";
      case "processing":
        return "Order is being processed";
      case "ready to ship":
        return "Your order is ready for shipment";
      case "shipped":
        return "Your order is on the way";
      case "out of delivery":
        return "Your order is out for delivery";
      case "delivered":
        return "Delivered";
      default:
        return status.charAt(0).toUpperCase() + status.slice(1);
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case "delivered":
        return "bg-green-100 text-green-800 border border-green-300";
      case "processing":
        return "bg-blue-100 text-blue-800 border border-blue-300";
      case "ready to ship":
        return "bg-yellow-100 text-yellow-800 border border-yellow-300";
      case "shipped":
        return "bg-purple-100 text-purple-800 border border-purple-300";
      case "out of delivery":
        return "bg-orange-100 text-orange-800 border border-orange-300";
      case "pending":
        return "bg-gray-100 text-gray-800 border border-gray-300";
      default:
        return "bg-gray-100 text-gray-800 border border-gray-300";
    }
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  const StarRating = ({ rating, setRating, isEditable = false }) => {
    return (
      <div className="flex items-center">
        {[1, 2, 3, 4, 5].map((star) => (
          <button
            key={star}
            type="button"
            onClick={() => isEditable && setRating(star)}
            className={`text-2xl ${
              star <= rating ? "text-yellow-400" : "text-gray-300"
            } ${isEditable ? "hover:text-yellow-500 transition-colors" : ""}`}
            disabled={!isEditable}
          >
            {star <= rating ? "★" : "☆"}
          </button>
        ))}
        <span className="ml-2 text-sm text-gray-600">({rating}/5)</span>
      </div>
    );
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex flex-col">
        <Navbar />
        <div className="flex-1 flex items-center justify-center">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-gray-700"></div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      <Navbar />
      <div className="flex-1 py-8">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="mb-8">
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
              <div>
                <h1 className="text-2xl font-semibold text-gray-900">
                  My Orders
                </h1>
                <p className="text-gray-600 mt-1">
                  Track and manage your purchases
                </p>
              </div>
              <div>
                <select
                  value={filter}
                  onChange={(e) => setFilter(e.target.value)}
                  className="bg-white text-gray-700 border border-gray-300 rounded-md px-4 py-2 focus:outline-none focus:ring-1 focus:ring-gray-400"
                >
                  <option value="all">All Orders</option>
                  <option value="pending">Pending</option>
                  <option value="processing">Processing</option>
                  <option value="ready to ship">Ready to Ship</option>
                  <option value="shipped">Shipped</option>
                  <option value="out of delivery">Out of Delivery</option>
                  <option value="delivered">Delivered</option>
                </select>
              </div>
            </div>
          </div>
          {filteredOrders.length === 0 ? (
            <div className="bg-white rounded-lg border border-gray-200 p-8 text-center">
              <svg
                className="w-16 h-16 text-gray-300 mx-auto mb-4"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M9 5H7a2 2 0 00-2 2v10a2 2 0 002 2h8a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2"
                />
              </svg>
              <h3 className="text-lg font-medium text-gray-900 mb-2">
                No orders found
              </h3>
              <p className="text-gray-600 mb-6">
                {filter === "all"
                  ? "You haven't placed any orders yet."
                  : `No ${filter} orders found.`}
              </p>
              <Link
                to="/home"
                className="inline-flex items-center px-4 py-2 bg-gray-800 text-white rounded-md hover:bg-gray-700 transition-colors"
              >
                Start Shopping
              </Link>
            </div>
          ) : (
            <div className="space-y-10">
              {filteredOrders.map((order) => (
                <div
                  key={order._id}
                  className="bg-white rounded-lg border border-gray-300 overflow-hidden"
                >
                  <div className="px-6 py-4 border-b border-gray-200 bg-gray-100 ">
                    <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center">
                      <div className="mb-2 sm:mb-0">
                        <span className="text-sm text-gray-600">Order #</span>
                        <span className="font-medium text-gray-900 ml-2">
                          {order.orderId}
                        </span>
                      </div>
                      <div className="flex items-center space-x-4">
                        <span className="text-sm text-gray-600">
                          {formatDate(order.createdAt)}
                        </span>
                        <span
                          className={`px-3 py-1 rounded-full text-xs font-medium ${getStatusColor(
                            order.status
                          )}`}
                        >
                          {getStatusDisplay(order.status)}
                        </span>
                      </div>
                    </div>
                  </div>
                  <div className="p-6">
                    <div className="space-y-4">
                      {order.items.map((item, index) => (
                        <div
                          key={index}
                          className="flex items-center space-x-4 py-4 border-b border-gray-100 last:border-b-0"
                        >
                          <img
                            src={
                              item.product.image
                                ? `http://localhost:5000/uploads/${item.product.image}`
                                : "https://via.placeholder.com/60x60?text=No+Image"
                            }
                            alt={item.product.name}
                            className="w-16 h-16 object-cover rounded border border-gray-200"
                          />
                          <div className="flex-1">
                            <h4 className="font-medium text-gray-900">
                              {item.product.name}
                            </h4>
                            <p className="text-sm text-gray-600">
                              Qty: {item.quantity}
                            </p>
                            {item.review && (
                              <div className="mt-2">
                                <div className="flex items-center">
                                  <StarRating rating={item.review.rating} />
                                </div>
                                {item.review.comment && (
                                  <p className="text-sm text-gray-600 mt-1">
                                    "{item.review.comment}"
                                  </p>
                                )}
                              </div>
                            )}
                          </div>
                          <div className="text-right">
                            <p className="font-medium text-gray-900">
                              LKR {(item.price * item.quantity).toFixed(2)}
                            </p>
                            <p className="text-sm text-gray-600">
                              LKR {item.price.toFixed(2)} each
                            </p>
                          </div>
                        </div>
                      ))}
                    </div>
                    <div className="border-t border-gray-200 mt-6 pt-6">
                      <div className="flex justify-between items-center">
                        <div>
                          <p className="text-sm text-gray-600">
                            {order.items.length} item
                            {order.items.length !== 1 ? "s" : ""}
                          </p>
                        </div>
                        <div className="text-right">
                          <p className="text-sm text-gray-600">
                            Shipping:{" "}
                            {order.shippingCost === 0
                              ? "FREE"
                              : `LKR ${order.shippingCost.toFixed(2)}`}
                          </p>
                          <p className="text-lg font-semibold text-gray-900">
                            Total: LKR {order.totalAmount.toFixed(2)}
                          </p>
                        </div>
                      </div>
                    </div>
                    {order.status === "delivered" && (
                      <div className="mt-8 pt-6 border-t border-gray-200">
                        <div className="bg-gradient-to-r from-gray-100 to-gray-200 p-4 rounded-lg border border-gray-400 shadow-sm mb-6">
                          <div className="flex items-center">
                            <div className="flex-shrink-0">
                              <svg
                                className="h-6 w-6 text-gray-500"
                                fill="none"
                                viewBox="0 0 24 24"
                                stroke="currentColor"
                              >
                                <path
                                  strokeLinecap="round"
                                  strokeLinejoin="round"
                                  strokeWidth={2}
                                  d="M11.049 2.927c.3-.921 1.603-.921 1.902 0l1.519 4.674a1 1 0 00.95.69h4.915c.969 0 1.371 1.24.588 1.81l-3.976 2.888a1 1 0 00-.363 1.118l1.518 4.674c.3.922-.755 1.688-1.538 1.118l-3.976-2.888a1 1 0 00-1.176 0l-3.976 2.888c-.783.57-1.838-.197-1.538-1.118l1.518-4.674a1 1 0 00-.363-1.118l-3.976-2.888c-.784-.57-.38-1.81.588-1.81h4.914a1 1 0 00.951-.69l1.519-4.674z"
                                />
                              </svg>
                            </div>
                            <div className="ml-3">
                              <h3 className="text-lg font-semibold text-gray-800">
                                Rate Your Purchase
                              </h3>
                              <p className="text-sm text-gray-600">
                                Share your experience to help other shoppers
                              </p>
                            </div>
                          </div>
                        </div>

                        {order.items.map((item, index) => (
                          <div key={index} className="mb-6 last:mb-0">
                            {!item.review ? (
                              <div className="bg-gray-50 p-5 rounded-xl border border-gray-300 shadow-sm transition-all hover:shadow-md">
                                <div className="flex items-start justify-between">
                                  <div className="flex items-center space-x-3">
                                    <img
                                      src={
                                        item.product.image
                                          ? `http://localhost:5000/uploads/${item.product.image}`
                                          : "https://via.placeholder.com/40x40?text=No+Image"
                                      }
                                      alt={item.product.name}
                                      className="w-12 h-12 object-cover rounded-lg border border-gray-200"
                                    />
                                    <div>
                                      <p className="text-sm font-medium text-gray-900">
                                        {item.product.name}
                                      </p>
                                      <p className="text-xs text-gray-500">
                                        How was your experience?
                                      </p>
                                    </div>
                                  </div>
                                  <button
                                    type="button"
                                    onClick={() =>
                                      setActiveReviewForm(
                                        activeReviewForm === item._id
                                          ? null
                                          : item._id
                                      )
                                    }
                                    className="px-4 py-2 text-sm bg-gradient-to-r from-gray-500 to-gray-600 text-white rounded-lg hover:from-gray-600 hover:to-gray-700 transition-all shadow-sm"
                                  >
                                    {activeReviewForm === item._id
                                      ? "Cancel"
                                      : "Add Review"}
                                  </button>
                                </div>

                                {activeReviewForm === item._id && (
                                  <form
                                    onSubmit={(e) => submitReview(e, item._id)}
                                    className="mt-5 p-5 bg-gray-50 rounded-lg border border-gray-200"
                                  >
                                    <div className="mb-5">
                                      <label className="block text-sm font-medium text-gray-800 mb-2">
                                        Your Rating
                                      </label>
                                      <div className="p-3 bg-white rounded-lg border border-gray-100 inline-block">
                                        <StarRating
                                          rating={review.rating}
                                          setRating={(rating) =>
                                            setReview({ ...review, rating })
                                          }
                                          isEditable={true}
                                        />
                                      </div>
                                    </div>
                                    <div className="mb-5">
                                      <label className="block text-sm font-medium text-gray-800 mb-2">
                                        Your Review
                                      </label>
                                      <textarea
                                        name="comment"
                                        value={review.comment}
                                        onChange={handleReviewChange}
                                        className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-gray-400 focus:border-transparent bg-white"
                                        placeholder="Share your experience with this product. What did you like or dislike?"
                                        required
                                        rows="3"
                                      />
                                      <p className="text-xs text-gray-600 mt-1">
                                        Your review will help other shoppers
                                        make informed decisions.
                                      </p>
                                    </div>
                                    <button
                                      type="submit"
                                      className="px-5 py-2.5 bg-gradient-to-r from-gray-700 to-gray-800 text-white rounded-lg hover:from-gray-800 hover:to-gray-900 transition-all shadow-md flex items-center"
                                    >
                                      <svg
                                        className="w-4 h-4 mr-2"
                                        fill="none"
                                        stroke="currentColor"
                                        viewBox="0 0 24 24"
                                      >
                                        <path
                                          strokeLinecap="round"
                                          strokeLinejoin="round"
                                          strokeWidth={2}
                                          d="M13 10V3L4 14h7v7l9-11h-7z"
                                        />
                                      </svg>
                                      Submit Review
                                    </button>
                                  </form>
                                )}
                              </div>
                            ) : (
                              <div className="bg-gradient-to-r from-green-50 to-emerald-50 p-5 rounded-xl border border-green-200 shadow-sm">
                                <div className="flex items-center space-x-3">
                                  <div className="flex-shrink-0">
                                    <div className="w-10 h-10 bg-green-100 rounded-full flex items-center justify-center">
                                      <svg
                                        className="w-5 h-5 text-green-600"
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
                                  </div>
                                  <div>
                                    <p className="text-sm font-medium text-green-800">
                                      You've reviewed this product
                                    </p>
                                    <div className="flex items-center mt-1">
                                      <StarRating rating={item.review.rating} />
                                    </div>
                                    {item.review.comment && (
                                      <p className="text-sm text-green-700 mt-2 italic">
                                        "{item.review.comment}"
                                      </p>
                                    )}
                                  </div>
                                </div>
                              </div>
                            )}
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
      <HelpCenter />
    </div>
  );
};

export default OrderBuyer;

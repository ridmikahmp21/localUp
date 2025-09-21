import React, { useState, useEffect } from "react";
import axios from "axios";
import { FiFilter, FiChevronDown, FiRefreshCw, FiSearch } from "react-icons/fi";
import Sidebar from "../../components/navbarSeller/Sidebar";
import Header from "../../components/navbarSeller/Header";
import { toast } from "react-toastify";

const Order = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filterOpen, setFilterOpen] = useState(false);
  const [selectedStatus, setSelectedStatus] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [updatingOrderId, setUpdatingOrderId] = useState(null);

  useEffect(() => {
    fetchOrders();
  }, []);

  const fetchOrders = async () => {
    try {
      const token = localStorage.getItem("token");
      if (!token) {
        console.error("No token found");
        return;
      }

      const response = await axios.get("http://localhost:5000/api/orders/all", {
        headers: { Authorization: `Bearer ${token}` },
      });
      setOrders(response.data);
    } catch (error) {
      console.error("Error fetching orders:", error);
    } finally {
      setLoading(false);
    }
  };

  const updateStatus = async (orderId, status) => {
    try {
      setUpdatingOrderId(orderId);
      const token = localStorage.getItem("token");
      console.log("Updating status to:", status, "for order:", orderId);
      const response = await axios.put(
        `http://localhost:5000/api/orders/${orderId}/status`,
        { status },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      console.log("Update response:", response.data);
      setOrders((prevOrders) =>
        prevOrders.map((order) =>
          order._id === orderId
            ? { ...order, status: response.data.status }
            : order
        )
      );
      toast.success("Status updated successfully");
    } catch (error) {
      console.error("Update failed:", error.response?.data || error.message);
      toast.error(error.response?.data?.message || "Failed to update status");
      fetchOrders();
    } finally {
      setUpdatingOrderId(null);
    }
  };

  const filteredOrders = orders.filter((order) => {
    const matchesStatus = selectedStatus
      ? order.status === selectedStatus
      : true;
    const matchesSearch =
      searchTerm === "" ||
      order.orderId.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (order.user?.name &&
        order.user.name.toLowerCase().includes(searchTerm.toLowerCase())) ||
      order.items.some(
        (item) =>
          item.product?.name &&
          item.product.name.toLowerCase().includes(searchTerm.toLowerCase())
      );

    return matchesStatus && matchesSearch;
  });

  const getStatusStyle = (status) => {
    switch (status.toLowerCase()) {
      case "delivered":
        return "bg-green-100 text-green-800";
      case "processing":
        return "bg-blue-100 text-blue-800";
      case "ready to ship":
        return "bg-yellow-100 text-yellow-800";
      case "shipped":
        return "bg-purple-100 text-purple-800";
      case "out of delivery":
        return "bg-orange-100 text-orange-800";
      case "pending":
        return "bg-gray-100 text-gray-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  const statusOrder = {
    pending: 0,
    processing: 1,
    "ready to ship": 2,
    shipped: 3,
    "out of delivery": 4,
    delivered: 5,
  };

  const validStatuses = [
    "pending",
    "processing",
    "ready to ship",
    "shipped",
    "out of delivery",
    "delivered",
  ];

  const getNextStatuses = (currentStatus) => {
    const currentIndex = statusOrder[currentStatus];
    return validStatuses.filter((status) => statusOrder[status] > currentIndex);
  };

  if (loading) {
    return (
      <div className="flex-1 bg-gray-50 min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-gray-800"></div>
      </div>
    );
  }

  return (
    <div className="flex bg-gray-50 min-h-screen">
      <Sidebar />
      <div className="flex-1 min-h-screen">
        <Header title="Order Management" />
        <div className="p-6">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
            <div className="bg-white rounded-lg shadow-sm p-4 border border-gray-200">
              <div className="text-gray-500 text-sm">Total Orders</div>
              <div className="text-2xl font-bold text-gray-800">
                {orders.length}
              </div>
            </div>
            <div className="bg-white rounded-lg shadow-sm p-4 border border-gray-200">
              <div className="text-gray-500 text-sm">Processing</div>
              <div className="text-2xl font-bold text-blue-600">
                {orders.filter((o) => o.status === "processing").length}
              </div>
            </div>
            <div className="bg-white rounded-lg shadow-sm p-4 border border-gray-200">
              <div className="text-gray-500 text-sm">In Progress</div>
              <div className="text-2xl font-bold text-purple-600">
                {
                  orders.filter((o) =>
                    ["ready to ship", "shipped", "out of delivery"].includes(
                      o.status
                    )
                  ).length
                }
              </div>
            </div>
            <div className="bg-white rounded-lg shadow-sm p-4 border border-gray-200">
              <div className="text-gray-500 text-sm">Delivered</div>
              <div className="text-2xl font-bold text-green-600">
                {orders.filter((o) => o.status === "delivered").length}
              </div>
            </div>
          </div>
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
            <div className="px-6 py-4 border-b border-gray-200 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
              <h2 className="text-xl font-semibold text-gray-800">
                Order List
              </h2>
              <div className="flex items-center gap-3 flex-wrap">
                <div className="relative">
                  <FiSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                  <input
                    type="text"
                    placeholder="Search orders..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-gray-500 focus:border-transparent"
                  />
                </div>
                <div className="relative">
                  <button
                    onClick={() => setFilterOpen(!filterOpen)}
                    className="flex items-center gap-2 px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
                  >
                    <FiFilter className="text-gray-600" />
                    <span className="text-gray-700">
                      {selectedStatus ? selectedStatus : "All Status"}
                    </span>
                    <FiChevronDown className="text-gray-600" />
                  </button>
                  {filterOpen && (
                    <div className="absolute right-0 mt-2 w-48 bg-white border border-gray-200 rounded-lg shadow-lg z-10">
                      <button
                        onClick={() => {
                          setSelectedStatus(null);
                          setFilterOpen(false);
                        }}
                        className={`block w-full text-left px-4 py-2 hover:bg-gray-50 ${
                          !selectedStatus
                            ? "bg-gray-50 text-gray-900"
                            : "text-gray-700"
                        }`}
                      >
                        All Orders
                      </button>
                      {[
                        "pending",
                        "processing",
                        "ready to ship",
                        "shipped",
                        "out of delivery",
                        "delivered",
                      ].map((status) => (
                        <button
                          key={status}
                          onClick={() => {
                            setSelectedStatus(status);
                            setFilterOpen(false);
                          }}
                          className={`block w-full text-left px-4 py-2 hover:bg-gray-50 ${
                            selectedStatus === status
                              ? "bg-gray-50 text-gray-900"
                              : "text-gray-700"
                          }`}
                        >
                          {status.charAt(0).toUpperCase() + status.slice(1)}
                        </button>
                      ))}
                    </div>
                  )}
                </div>
                <button
                  onClick={() => {
                    setSelectedStatus(null);
                    setSearchTerm("");
                    fetchOrders();
                  }}
                  className="flex items-center gap-2 px-4 py-2 text-gray-700 hover:text-gray-900 hover:bg-gray-50 rounded-lg transition-colors"
                >
                  <FiRefreshCw />
                  <span>Refresh</span>
                </button>
              </div>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-gray-50">
                  <tr className="text-left text-gray-600 text-sm font-medium">
                    <th className="px-6 py-3">Order ID</th>
                    <th className="px-6 py-3">Customer</th>
                    <th className="px-6 py-3">Date</th>
                    <th className="px-6 py-3">Product</th>
                    <th className="px-6 py-3">Qty</th>
                    <th className="px-6 py-3">Price</th>
                    <th className="px-6 py-3">Total</th>
                    <th className="px-6 py-3">Status</th>
                    <th className="px-6 py-3">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200">
                  {filteredOrders.length === 0 ? (
                    <tr>
                      <td
                        colSpan="9"
                        className="px-6 py-8 text-center text-gray-500"
                      >
                        No orders found
                      </td>
                    </tr>
                  ) : (
                    filteredOrders.map((order) =>
                      order.items.map((item, index) => (
                        <tr
                          key={`${order._id}-${index}`}
                          className="hover:bg-gray-50 transition-colors"
                        >
                          {index === 0 && (
                            <td
                              rowSpan={order.items.length}
                              className="px-6 py-4 font-medium text-gray-900"
                            >
                              {order.orderId}
                            </td>
                          )}
                          {index === 0 && (
                            <td
                              rowSpan={order.items.length}
                              className="px-6 py-4"
                            >
                              <div>
                                <div className="font-medium text-gray-900">
                                  {order.user?.name || "Unknown"}
                                </div>
                                <div className="text-sm text-gray-500">
                                  {order.customerDetails.address || "N/A"}
                                </div>
                              </div>
                            </td>
                          )}
                          {index === 0 && (
                            <td
                              rowSpan={order.items.length}
                              className="px-6 py-4 text-sm text-gray-600"
                            >
                              {new Date(order.createdAt).toLocaleDateString(
                                "en-US",
                                {
                                  year: "numeric",
                                  month: "short",
                                  day: "numeric",
                                }
                              )}
                            </td>
                          )}
                          <td className="px-6 py-4">
                            <div>
                              <div className="font-medium text-gray-900">
                                {item.product?.name || "N/A"}
                              </div>
                              <div className="text-sm text-gray-500">
                                {item.product?.category || "N/A"}
                              </div>
                            </div>
                          </td>
                          <td className="px-6 py-4 text-gray-600">
                            {item.quantity}
                          </td>
                          <td className="px-6 py-4 font-medium text-gray-900">
                            LKR {item.price.toFixed(2)}
                          </td>
                          <td className="px-6 py-4 font-bold text-blue-700">
                            LKR {(item.price * item.quantity).toFixed(2)}
                          </td>
                          {index === 0 && (
                            <td
                              rowSpan={order.items.length}
                              className="px-6 py-4"
                            >
                              <span
                                className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-medium ${getStatusStyle(
                                  order.status
                                )}`}
                              >
                                {order.status}
                              </span>
                            </td>
                          )}
                          {index === 0 && (
                            <td
                              rowSpan={order.items.length}
                              className="px-6 py-4"
                            >
                              <select
                                value={order.status}
                                onChange={(e) =>
                                  updateStatus(order._id, e.target.value)
                                }
                                disabled={updatingOrderId === order._id}
                                className="border border-gray-300 rounded-md px-3 py-1.5 text-sm focus:outline-none focus:ring-2 focus:ring-gray-500 focus:border-transparent disabled:opacity-50 disabled:cursor-not-allowed"
                              >
                                <option value="pending">Pending</option>
                                <option value="processing">Processing</option>
                                <option value="ready to ship">
                                  Ready to Ship
                                </option>
                                <option value="shipped">Shipped</option>
                                <option value="out of delivery">
                                  Out of Delivery
                                </option>
                                <option value="delivered">Delivered</option>
                              </select>
                              {updatingOrderId === order._id && (
                                <div className="mt-1 text-xs text-gray-500">
                                  Updating...
                                </div>
                              )}
                            </td>
                          )}
                        </tr>
                      ))
                    )
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Order;

import React, { useState, useEffect } from "react";
import axios from "axios";
import {
  FiFilter,
  FiChevronDown,
  FiRefreshCw,
  FiSearch,
  FiDollarSign,
} from "react-icons/fi";
import Sidebar from "../../components/navbarSeller/Sidebar";
import Header from "../../components/navbarSeller/Header";
import { toast } from "react-toastify";

const Payment = () => {
  const [payments, setPayments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filterOpen, setFilterOpen] = useState(false);
  const [selectedStatus, setSelectedStatus] = useState("completed"); // Default to completed
  const [selectedMethod, setSelectedMethod] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [dateRange, setDateRange] = useState({ start: "", end: "" });

  useEffect(() => {
    fetchPayments();
  }, []);

  // Sample data for demonstration - only completed payments with PayHere method
  const samplePayments = [
    {
      _id: "pay_5f9d7b6e8c8a8b1d2c3e4f5a",
      orderId: "ORD-123456",
      buyer: {
        name: "Samantha Perera",
        email: "samantha@example.com",
      },
      createdAt: "2025-09-15T10:45:00.000Z",
      method: "payhere",
      amount: 1460.0,
      status: "completed",
    },
    {
      _id: "pay_6a8b9c0d1e2f3g4h5i6j7k8l",
      orderId: "ORD-123457",
      buyer: {
        name: "Rajesh Kumar",
        email: "rajesh@example.com",
      },
      createdAt: "2025-09-14T14:15:00.000Z",
      method: "payhere",
      amount: 7750.0,
      status: "completed",
    },
    {
      _id: "pay_7m8n9o0p1q2r3s4t5u6v7w8x",
      orderId: "ORD-123458",
      buyer: {
        name: "Lisa Chen",
        email: "lisa@example.com",
      },
      createdAt: "2025-09-12T09:30:00.000Z",
      method: "payhere",
      amount: 1520.0,
      status: "completed",
    },
    {
      _id: "pay_9y0z1a2b3c4d5e6f7g8h9i0j",
      orderId: "ORD-123459",
      buyer: {
        name: "Michael Silva",
        email: "michael@example.com",
      },
      createdAt: "2025-09-10T16:50:00.000Z",
      method: "payhere",
      amount: 4100.0,
      status: "completed",
    },
    {
      _id: "pay_1k2l3m4n5o6p7q8r9s0t1u2v",
      orderId: "ORD-123460",
      buyer: {
        name: "Emma Thompson",
        email: "emma@example.com",
      },
      createdAt: "2025-09-08T11:20:00.000Z",
      method: "payhere",
      amount: 6200.0,
      status: "completed",
    },
    {
      _id: "pay_3w4x5y6z7a8b9c0d1e2f3g4h",
      orderId: "ORD-123461",
      buyer: {
        name: "David Wilson",
        email: "david@example.com",
      },
      createdAt: "2025-09-05T15:40:00.000Z",
      method: "payhere",
      amount: 3500.0,
      status: "completed",
    },
    {
      _id: "pay_5i6j7k8l9m0n1o2p3q4r5s6t",
      orderId: "ORD-123462",
      buyer: {
        name: "Priya Patel",
        email: "priya@example.com",
      },
      createdAt: "2025-09-03T13:15:00.000Z",
      method: "payhere",
      amount: 1400.0,
      status: "completed",
    },
    {
      _id: "pay_7u8v9w0x1y2z3a4b5c6d7e8f",
      orderId: "ORD-123463",
      buyer: {
        name: "James Anderson",
        email: "james@example.com",
      },
      createdAt: "2025-09-01T09:45:00.000Z",
      method: "payhere",
      amount: 1900.0,
      status: "completed",
    },
  ];

  const fetchPayments = async () => {
    try {
      const token = localStorage.getItem("token");
      if (!token) {
        console.error("No token found");
        setPayments(samplePayments);
        setLoading(false);
        return;
      }

      const response = await axios.get(
        "http://localhost:5000/api/payments/seller",
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      const completedPayments = response.data.filter(
        (payment) => payment.status === "completed"
      );
      setPayments(completedPayments);
    } catch (error) {
      console.error("Error fetching payments:", error);
      setPayments(samplePayments);
      // toast.error("Failed to fetch payments. Showing sample data.");
    } finally {
      setLoading(false);
    }
  };

  const filteredPayments = payments.filter((payment) => {
    const matchesStatus = selectedStatus
      ? payment.status === selectedStatus
      : true;
    const matchesMethod = selectedMethod
      ? payment.method === selectedMethod
      : true;
    const matchesSearch =
      searchTerm === "" ||
      payment.orderId.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (payment.buyer?.name &&
        payment.buyer.name.toLowerCase().includes(searchTerm.toLowerCase())) ||
      payment._id.toLowerCase().includes(searchTerm.toLowerCase());

    // Date range filtering
    const paymentDate = new Date(payment.createdAt);
    const matchesDateRange =
      (!dateRange.start || paymentDate >= new Date(dateRange.start)) &&
      (!dateRange.end || paymentDate <= new Date(dateRange.end + "T23:59:59"));

    return matchesStatus && matchesMethod && matchesSearch && matchesDateRange;
  });

  const getStatusStyle = (status) => {
    switch (status.toLowerCase()) {
      case "completed":
        return "bg-green-100 text-green-800";
      case "pending":
        return "bg-yellow-100 text-yellow-800";
      case "failed":
        return "bg-red-100 text-red-800";
      case "refunded":
        return "bg-blue-100 text-blue-800";
      default:
        return "bg-gray-100 text-gray-800";
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

  const getTotalRevenue = () => {
    return payments
      .filter((p) => p.status === "completed")
      .reduce((sum, payment) => sum + payment.amount, 0);
  };

  const getPendingAmount = () => {
    return payments
      .filter((p) => p.status === "pending")
      .reduce((sum, payment) => sum + payment.amount, 0);
  };

  if (loading) {
    return (
      <div className="flex-1 ml-64 bg-gray-50 min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-gray-800"></div>
      </div>
    );
  }

  return (
    <div className="flex bg-gray-50 min-h-screen">
      <Sidebar />
      <div className="flex-1 min-h-screen">
        <Header title="Payment Management" />
        <div className="p-6">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
            <div className="bg-white rounded-lg shadow-sm p-4 border border-gray-200">
              <div className="text-gray-500 text-sm">Total Payments</div>
              <div className="text-2xl font-bold text-gray-800">
                {payments.length}
              </div>
            </div>
            <div className="bg-white rounded-lg shadow-sm p-4 border border-gray-200">
              <div className="text-gray-500 text-sm">Total Revenue</div>
              <div className="text-2xl font-bold text-green-600">
                LKR {getTotalRevenue().toFixed(2)}
              </div>
            </div>
            {/* <div className="bg-white rounded-lg shadow-sm p-4 border border-gray-200">
              <div className="text-gray-500 text-sm">Pending Payments</div>
              <div className="text-2xl font-bold text-yellow-600">
                LKR {getPendingAmount().toFixed(2)}
              </div>
            </div>
            <div className="bg-white rounded-lg shadow-sm p-4 border border-gray-200">
              <div className="text-gray-500 text-sm">Failed Payments</div>
              <div className="text-2xl font-bold text-red-600">
                {payments.filter((p) => p.status === "failed").length}
              </div>
            </div> */}
          </div>

          <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden mb-6">
            <div className="px-6 py-4 border-b border-gray-200">
              <h2 className="text-lg font-semibold text-gray-800 mb-2">
                Date Filter
              </h2>
              <div className="flex flex-wrap gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    From Date
                  </label>
                  <input
                    type="date"
                    value={dateRange.start}
                    onChange={(e) =>
                      setDateRange({ ...dateRange, start: e.target.value })
                    }
                    className="px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-gray-500"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    To Date
                  </label>
                  <input
                    type="date"
                    value={dateRange.end}
                    onChange={(e) =>
                      setDateRange({ ...dateRange, end: e.target.value })
                    }
                    className="px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-gray-500"
                  />
                </div>
                <div className="flex items-end">
                  <button
                    onClick={() => setDateRange({ start: "", end: "" })}
                    className="px-4 py-2 bg-gray-100 text-gray-700 rounded-md hover:bg-gray-200"
                  >
                    Clear
                  </button>
                </div>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
            <div className="px-6 py-4 border-b border-gray-200 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
              <h2 className="text-xl font-semibold text-gray-800">
                Payment List
              </h2>
              <div className="flex items-center gap-3 flex-wrap">
                <div className="relative">
                  <FiSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                  <input
                    type="text"
                    placeholder="Search payments..."
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
                      {selectedStatus ? "Completed" : "All Status"}
                    </span>
                    <FiChevronDown className="text-gray-600" />
                  </button>
                  {filterOpen && (
                    <div className="absolute right-0 mt-2 w-48 bg-white border border-gray-200 rounded-lg shadow-lg z-10">
                      <div className="p-2 border-b border-gray-200 font-medium text-gray-700">
                        Payment Status
                      </div>
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
                        All Status
                      </button>
                      <button
                        onClick={() => {
                          setSelectedStatus("completed");
                          setFilterOpen(false);
                        }}
                        className={`block w-full text-left px-4 py-2 hover:bg-gray-50 ${
                          selectedStatus === "completed"
                            ? "bg-gray-50 text-gray-900"
                            : "text-gray-700"
                        }`}
                      >
                        Completed
                      </button>
                    </div>
                  )}
                </div>
                <button
                  onClick={() => {
                    setSelectedStatus("completed");
                    setSelectedMethod(null);
                    setSearchTerm("");
                    setDateRange({ start: "", end: "" });
                    fetchPayments();
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
                    <th className="px-6 py-3">Payment ID</th>
                    <th className="px-6 py-3">Order ID</th>
                    <th className="px-6 py-3">Buyer</th>
                    <th className="px-6 py-3">Date & Time</th>
                    <th className="px-6 py-3">Method</th>
                    <th className="px-6 py-3">Amount</th>
                    <th className="px-6 py-3">Status</th>
                    <th className="px-6 py-3">Details</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200">
                  {filteredPayments.length === 0 ? (
                    <tr>
                      <td
                        colSpan="8"
                        className="px-6 py-8 text-center text-gray-500"
                      >
                        No payments found
                      </td>
                    </tr>
                  ) : (
                    filteredPayments.map((payment) => (
                      <tr
                        key={payment._id}
                        className="hover:bg-gray-50 transition-colors"
                      >
                        <td className="px-6 py-4 font-medium text-gray-900">
                          {payment._id.slice(-8).toUpperCase()}
                        </td>
                        <td className="px-6 py-4 font-medium text-blue-600">
                          {payment.orderId}
                        </td>
                        <td className="px-6 py-4">
                          <div>
                            <div className="font-medium text-gray-900">
                              {payment.buyer?.name || "Unknown"}
                            </div>
                            <div className="text-sm text-gray-500">
                              {payment.buyer?.email || "N/A"}
                            </div>
                          </div>
                        </td>
                        <td className="px-6 py-4 text-sm text-gray-600">
                          {formatDate(payment.createdAt)}
                        </td>
                        <td className="px-6 py-4">
                          <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                            PayHere
                          </span>
                        </td>
                        <td className="px-6 py-4 font-bold text-green-700">
                          LKR {payment.amount.toFixed(2)}
                        </td>
                        <td className="px-6 py-4">
                          <span
                            className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-medium ${getStatusStyle(
                              payment.status
                            )}`}
                          >
                            {payment.status}
                          </span>
                        </td>
                        <td className="px-6 py-4">
                          <button className="text-blue-600 hover:text-blue-800 text-sm font-medium">
                            View Details
                          </button>
                        </td>
                      </tr>
                    ))
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

export default Payment;

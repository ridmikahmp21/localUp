import React, { useState, useEffect } from "react";
import {
  FiEdit,
  FiTrash2,
  FiPlus,
  FiFilter,
  FiX,
  FiChevronDown,
  FiChevronRight,
} from "react-icons/fi";
import Sidebar from "../../components/navbarSeller/Sidebar";
import Header from "../../components/navbarSeller/Header";
import { Link } from "react-router-dom";
import axios from "axios";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const ProductStock = () => {
  const [products, setProducts] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [selectedStatus, setSelectedStatus] = useState("All");
  const [deleteModal, setDeleteModal] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [expandedProduct, setExpandedProduct] = useState(null);
  const [viewMode, setViewMode] = useState("table");

  useEffect(() => {
    axios
      .get("http://localhost:5000/api/products")
      .then((res) => {
        setProducts(res.data);
        setTimeout(() => setLoading(false), 600);
      })
      .catch((err) => {
        console.error("Error fetching products:", err);
        setLoading(false);
      });
  }, []);

  const handleDelete = async () => {
    try {
      await axios.delete(
        `http://localhost:5000/api/products/${selectedProduct._id}`
      );
      toast.success("Product deleted successfully!", {
        position: "top-right",
        autoClose: 2000,
      });
      setProducts(products.filter((p) => p._id !== selectedProduct._id));
      setDeleteModal(false);
    } catch (err) {
      toast.error("Failed to delete product.", {
        position: "top-right",
        autoClose: 3000,
      });
    }
  };

  const toggleExpand = (productId) => {
    if (expandedProduct === productId) {
      setExpandedProduct(null);
    } else {
      setExpandedProduct(productId);
    }
  };

  const filteredProducts = products.filter((product) => {
    const categoryMatch =
      selectedCategory === "All" ||
      product.category?.trim().toLowerCase() ===
        selectedCategory.trim().toLowerCase();

    const statusMatch =
      selectedStatus === "All" ||
      product.status?.trim().toLowerCase() ===
        selectedStatus.trim().toLowerCase();

    return categoryMatch && statusMatch;
  });

  const truncateText = (text, maxLength) => {
    if (!text) return "";
    if (text.length <= maxLength) return text;
    return text.substring(0, maxLength) + "...";
  };

  return (
    <div className="flex relative bg-gray-50 min-h-screen">
      <Sidebar />
      <div
        className={`flex-1 transition-all ${
          deleteModal ? "blur-sm" : ""
        }`}
      >
        <Header />
        <div className="p-6">
          <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
            <div className="flex flex-col md:flex-row md:justify-between md:items-center mb-6">
              <div>
                <h2 className="text-2xl font-bold text-gray-800">
                  Product Stock
                </h2>
                <p className="text-gray-500 mt-1">
                  Manage your product inventory and stock levels
                </p>
              </div>
              <div className="flex items-center mt-4 md:mt-0 space-x-3">
                <div className="bg-gray-100 rounded-lg p-1 flex">
                  <button
                    onClick={() => setViewMode("table")}
                    className={`px-3 py-1.5 rounded-md text-sm font-medium ${
                      viewMode === "table"
                        ? "bg-white shadow-sm text-gray-800"
                        : "text-gray-600"
                    }`}
                  >
                    Table View
                  </button>
                  <button
                    onClick={() => setViewMode("card")}
                    className={`px-3 py-1.5 rounded-md text-sm font-medium ${
                      viewMode === "card"
                        ? "bg-white shadow-sm text-gray-800"
                        : "text-gray-600"
                    }`}
                  >
                    Card View
                  </button>
                </div>
                <Link to="/addProduct">
                  <button className="flex items-center bg-gray-500 hover:bg-slate-700 text-white py-2.5 px-5 rounded-lg transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2">
                    <FiPlus className="mr-2" />
                    Add New Product
                  </button>
                </Link>
              </div>
            </div>

            {loading ? (
              <div className="flex justify-center items-center py-20">
                <div className="flex flex-col items-center">
                  <div className="w-16 h-16 border-4 border-indigo-600 border-l-transparent rounded-full animate-spin mb-4"></div>
                  <span className="text-lg font-medium text-gray-600">
                    Loading products...
                  </span>
                </div>
              </div>
            ) : (
              <div className="transition-opacity duration-700 ease-in opacity-100">
                <div className="bg-gray-50 rounded-lg p-4 mb-6 border border-gray-200">
                  <div className="flex items-center mb-3">
                    <FiFilter className="text-gray-500 mr-2" />
                    <h3 className="text-lg font-medium text-gray-700">
                      Filter Products
                    </h3>
                  </div>
                  <div className="flex flex-col md:flex-row md:items-center space-y-4 md:space-y-0 md:space-x-4">
                    <div className="flex-grow">
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Category
                      </label>
                      <select
                        value={selectedCategory}
                        onChange={(e) => setSelectedCategory(e.target.value)}
                        className="w-full border border-gray-300 rounded-lg px-4 py-2.5 bg-white focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-colors duration-200"
                      >
                        <option value="All">All Categories</option>
                        <option value="Fashion & Apparel">
                          Fashion & Apparel
                        </option>
                        <option value="Beauty & Skincare">
                          Beauty & Skincare
                        </option>
                        <option value="Home & Living">Home & Living</option>
                        <option value="Food & Beverages">
                          Food & Beverages
                        </option>
                        <option value="Health Products">Health Products</option>
                        <option value="Accessories">Accessories</option>
                        <option value="Handicrafts">Handicrafts</option>
                        <option value="Luxury & Lifestyle">
                          Luxury & Lifestyle
                        </option>
                        <option value="Books & Stationery">
                          Books & Stationery
                        </option>
                      </select>
                    </div>
                    <div className="flex-grow">
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Status
                      </label>
                      <select
                        value={selectedStatus}
                        onChange={(e) => setSelectedStatus(e.target.value)}
                        className="w-full border border-gray-300 rounded-lg px-4 py-2.5 bg-white focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-colors duration-200"
                      >
                        <option value="All">All Status</option>
                        <option value="In Stock">In Stock</option>
                        <option value="Out of Stock">Out of Stock</option>
                      </select>
                    </div>
                    <div className="self-end">
                      <button
                        onClick={() => {
                          setSelectedCategory("All");
                          setSelectedStatus("All");
                        }}
                        className="flex items-center text-red-500 hover:text-red-700 text-sm font-medium py-2.5 px-4 border border-red-200 hover:border-red-300 rounded-lg transition-colors duration-200"
                      >
                        <FiX className="mr-1" />
                        Reset Filters
                      </button>
                    </div>
                  </div>
                </div>

                {filteredProducts.length === 0 && (
                  <div className="text-center py-16 bg-white rounded-xl border border-gray-200 mb-6">
                    <div className="mx-auto w-24 h-24 bg-gray-100 rounded-full flex items-center justify-center mb-4">
                      <svg
                        className="w-12 h-12 text-gray-400"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                        xmlns="http://www.w3.org/2000/svg"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth="2"
                          d="M20 13V6a2 2 0 00-2-2H6a2 2 0 00-2 2v7m16 0v5a2 2 0 01-2 2H6a2 2 0 01-2-2v-5m16 0h-16"
                        ></path>
                      </svg>
                    </div>
                    <p className="text-gray-500 text-lg mb-2">
                      {products.length === 0
                        ? "No products found"
                        : "No products match your filters"}
                    </p>
                    <p className="text-gray-400 mb-4">
                      {products.length === 0
                        ? "Get started by adding your first product"
                        : "Try adjusting your filters to see more results"}
                    </p>
                    {products.length === 0 && (
                      <Link to="/addProduct">
                        <button className="bg-indigo-600 hover:bg-indigo-700 text-white py-2 px-6 rounded-lg transition-colors duration-200">
                          Add Your First Product
                        </button>
                      </Link>
                    )}
                  </div>
                )}

                {filteredProducts.length > 0 && viewMode === "table" && (
                  <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
                    <div className="overflow-x-auto">
                      <table className="w-full">
                        <thead className="bg-gray-50">
                          <tr>
                            <th className="px-4 py-3 text-left text-sm font-medium text-gray-700 uppercase tracking-wider">
                              Product
                            </th>
                            <th className="px-4 py-3 text-left text-sm font-medium text-gray-700 uppercase tracking-wider">
                              Category
                            </th>
                            <th className="px-4 py-3 text-left text-sm font-medium text-gray-700 uppercase tracking-wider">
                              Price
                            </th>
                            <th className="px-4 py-3 text-left text-sm font-medium text-gray-700 uppercase tracking-wider">
                              Quantity
                            </th>
                            <th className="px-4 py-3 text-left text-sm font-medium text-gray-700 uppercase tracking-wider">
                              Status
                            </th>
                            <th className="px-4 py-3 text-left text-sm font-medium text-gray-700 uppercase tracking-wider">
                              Actions
                            </th>
                            <th className="px-4 py-3 text-left text-sm font-medium text-gray-700 uppercase tracking-wider">
                              Details
                            </th>
                          </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-200">
                          {filteredProducts.map((product, index) => (
                            <React.Fragment key={product._id || index}>
                              <tr className="hover:bg-gray-50 transition-colors duration-150">
                                <td className="px-4 py-4">
                                  <div className="flex items-center">
                                    <div className="flex-shrink-0 h-12 w-12">
                                      <img
                                        src={`http://localhost:5000/uploads/${product.image}`}
                                        alt={product.name}
                                        className="h-12 w-12 rounded-lg object-cover shadow-sm"
                                      />
                                    </div>
                                    <div className="ml-4">
                                      <div className="text-sm font-medium text-gray-900">
                                        {product.name}
                                      </div>
                                      <div className="text-sm text-gray-500">
                                        {truncateText(product.description, 40)}
                                      </div>
                                    </div>
                                  </div>
                                </td>
                                <td className="px-4 py-4">
                                  <div className="text-sm text-gray-900">
                                    {product.category}
                                  </div>
                                </td>
                                <td className="px-4 py-4">
                                  <div className="text-sm font-medium text-gray-900">
                                    LKR {product.price.toFixed(2)}
                                  </div>
                                </td>
                                <td className="px-4 py-4">
                                  <div className="text-sm text-gray-900">
                                    {product.quantity}
                                  </div>
                                </td>
                                <td className="px-4 py-4">
                                  <span
                                    className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium ${
                                      product.status === "Out of Stock"
                                        ? "bg-red-100 text-red-800"
                                        : "bg-green-100 text-green-800"
                                    }`}
                                  >
                                    {product.status}
                                  </span>
                                </td>
                                <td className="px-4 py-4">
                                  <div className="flex items-center space-x-2">
                                    <Link to={`/editProduct/${product._id}`}>
                                      <button className="text-indigo-600 hover:text-indigo-900 p-2 rounded-lg hover:bg-indigo-50 transition-colors duration-200">
                                        <FiEdit className="h-5 w-5" />
                                      </button>
                                    </Link>
                                    <button
                                      onClick={() => {
                                        setSelectedProduct(product);
                                        setDeleteModal(true);
                                      }}
                                      className="text-red-600 hover:text-red-900 p-2 rounded-lg hover:bg-red-50 transition-colors duration-200"
                                    >
                                      <FiTrash2 className="h-5 w-5" />
                                    </button>
                                  </div>
                                </td>
                                <td className="px-4 py-4">
                                  <button
                                    onClick={() => toggleExpand(product._id)}
                                    className="text-gray-500 hover:text-gray-700 p-2 rounded-lg hover:bg-gray-100 transition-colors duration-200"
                                  >
                                    {expandedProduct === product._id ? (
                                      <FiChevronDown className="h-5 w-5" />
                                    ) : (
                                      <FiChevronRight className="h-5 w-5" />
                                    )}
                                  </button>
                                </td>
                              </tr>
                              {expandedProduct === product._id && (
                                <tr className="bg-gray-50">
                                  <td colSpan="7" className="px-4 py-4">
                                    <div className="grid grid-cols-2 gap-4 text-sm">
                                      <div>
                                        <h4 className="font-medium text-gray-700 mb-2">
                                          Product Details
                                        </h4>
                                        <p className="text-gray-600">
                                          {product.description}
                                        </p>
                                      </div>
                                      <div>
                                        <h4 className="font-medium text-gray-700 mb-2">
                                          Additional Information
                                        </h4>
                                        <p className="text-gray-600">
                                          Product ID: {product._id}
                                        </p>
                                        <p className="text-gray-600">
                                          Last Updated:{" "}
                                          {new Date().toLocaleDateString()}
                                        </p>
                                      </div>
                                    </div>
                                  </td>
                                </tr>
                              )}
                            </React.Fragment>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  </div>
                )}

                {filteredProducts.length > 0 && viewMode === "card" && (
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                    {filteredProducts.map((product, index) => (
                      <div
                        key={product._id || index}
                        className="bg-white rounded-lg border border-gray-200 p-4 hover:shadow-md transition-shadow duration-200"
                      >
                        <div className="flex items-start justify-between">
                          <div className="flex items-center">
                            <img
                              src={`http://localhost:5000/uploads/${product.image}`}
                              alt={product.name}
                              className="h-14 w-14 rounded-lg object-cover shadow-sm"
                            />
                            <div className="ml-3">
                              <h3 className="text-base font-medium text-gray-900">
                                {truncateText(product.name, 20)}
                              </h3>
                              <p className="text-sm text-gray-500">
                                {product.category}
                              </p>
                            </div>
                          </div>
                          <div className="flex items-center space-x-1">
                            <span
                              className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                                product.status === "Out of Stock"
                                  ? "bg-red-100 text-red-800"
                                  : "bg-green-100 text-green-800"
                              }`}
                            >
                              {product.status}
                            </span>
                            <button
                              onClick={() => toggleExpand(product._id)}
                              className="text-gray-500 hover:text-gray-700 ml-1"
                            >
                              {expandedProduct === product._id ? (
                                <FiChevronDown className="h-4 w-4" />
                              ) : (
                                <FiChevronRight className="h-4 w-4" />
                              )}
                            </button>
                          </div>
                        </div>

                        <div className="mt-4 grid grid-cols-2 gap-2">
                          <div>
                            <p className="text-xs text-gray-500">Price</p>
                            <p className="text-sm font-medium text-gray-900">
                              LKR {product.price.toFixed(2)}
                            </p>
                          </div>
                          <div>
                            <p className="text-xs text-gray-500">Quantity</p>
                            <p className="text-sm font-medium text-gray-900">
                              {product.quantity}
                            </p>
                          </div>
                        </div>

                        {expandedProduct === product._id && (
                          <div className="mt-3 p-3 bg-gray-50 rounded-lg">
                            <p className="text-xs text-gray-500 mb-1">
                              Full Description
                            </p>
                            <p className="text-sm text-gray-700">
                              {product.description}
                            </p>
                            <div className="mt-2 pt-2 border-t border-gray-200">
                              <p className="text-xs text-gray-500">
                                Product ID: {product._id}
                              </p>
                            </div>
                          </div>
                        )}

                        <div className="mt-4 flex justify-end space-x-2">
                          <Link to={`/editProduct/${product._id}`}>
                            <button className="text-indigo-600 hover:text-indigo-900 p-1.5 rounded-lg hover:bg-indigo-50 transition-colors duration-200">
                              <FiEdit className="h-4 w-4" />
                            </button>
                          </Link>
                          <button
                            onClick={() => {
                              setSelectedProduct(product);
                              setDeleteModal(true);
                            }}
                            className="text-red-600 hover:text-red-900 p-1.5 rounded-lg hover:bg-red-50 transition-colors duration-200"
                          >
                            <FiTrash2 className="h-4 w-4" />
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
      </div>

      {deleteModal && selectedProduct && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50 transition-opacity duration-300">
          <div className="bg-white p-6 rounded-xl shadow-xl w-96 max-w-md mx-4 transform transition-transform duration-300 scale-100">
            <h2 className="text-xl font-semibold text-gray-800 mb-2">
              Delete Product
            </h2>
            <p className="mb-6 text-gray-600">
              Are you sure you want to delete{" "}
              <span className="font-semibold text-gray-800">
                "{selectedProduct.name}"
              </span>
              ? This action cannot be undone.
            </p>
            <div className="flex gap-3 justify-end">
              <button
                onClick={() => setDeleteModal(false)}
                className="px-4 py-2.5 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 transition-colors duration-200"
              >
                Cancel
              </button>
              <button
                onClick={handleDelete}
                className="px-4 py-2.5 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2"
              >
                Delete Product
              </button>
            </div>
          </div>
        </div>
      )}

      <ToastContainer />
    </div>
  );
};

export default ProductStock;

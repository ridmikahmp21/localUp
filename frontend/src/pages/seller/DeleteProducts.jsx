import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";
import Sidebar from "../../components/navbarSeller/Sidebar";
import Header from "../../components/navbarSeller/Header";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const DeleteProduct = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [deleting, setDeleting] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchProduct = async () => {
      try {
        const { data } = await axios.get(
          `http://localhost:5000/api/products/${id}`
        );
        setProduct(data);
      } catch (err) {
        console.error("Error fetching product:", err);
        setError("Failed to load product details.");
        toast.error("Failed to load product details.");
      } finally {
        setLoading(false);
      }
    };
    fetchProduct();
  }, [id]);

  const handleDelete = async () => {
    try {
      setDeleting(true);
      await axios.delete(`http://localhost:5000/api/products/${id}`);

      toast.success("Product deleted successfully!", {
        autoClose: 2000,
        onClose: () => navigate("/products"),
      });
    } catch (err) {
      console.error("Error deleting product:", err);
      toast.error(
        err.response?.data?.message ||
          "Failed to delete product. Please try again."
      );
      setError(err.response?.data?.message || "Failed to delete product.");
    } finally {
      setDeleting(false);
    }
  };

  if (loading) {
    return (
      <div className="flex">
        <Sidebar />
        <div className="flex-1 bg-gray-50 min-h-screen p-8">
          <Header />
          <div className="flex items-center justify-center min-h-screen">
            <p className="text-gray-600 text-base">
              Loading product details...
            </p>
          </div>
        </div>
      </div>
    );
  }

  if (error && !product) {
    return (
      <div className="flex">
        <Sidebar />
        <div className="flex-1 ml-64 bg-gray-50 min-h-screen p-8">
          <Header />
          <div className="w-full bg-white rounded-md shadow-md p-6 mt-6">
            <p className="text-red-500 text-base">{error}</p>
            <button
              onClick={() => navigate("/products")}
              className="bg-gray-800 text-white py-2 px-6 rounded-md hover:bg-gray-900 focus:outline-none transition duration-200 mt-4 font-medium"
            >
              Back to Products
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="flex">
      <Sidebar />
      <div className="flex-1 ml-64 bg-gray-50 min-h-screen p-8">
        <Header />
        <div className="w-full bg-white rounded-md shadow-md p-6 mt-6">
          <h2 className="text-xl font-semibold text-gray-800 mb-6">
            Delete Product
          </h2>

          {error && <p className="text-red-500 text-base mb-4">{error}</p>}

          <p className="mb-4 text-base text-gray-700">
            Are you sure you want to delete the product{" "}
            <span className="font-semibold">"{product?.name}"</span>?
          </p>

          <p className="mb-6 text-sm text-gray-600">
            This action cannot be undone. All product data including images will
            be permanently removed.
          </p>

          <div className="flex gap-4">
            <button
              onClick={handleDelete}
              disabled={deleting}
              className="bg-red-600 text-white py-2 px-6 rounded-md hover:bg-red-700 focus:outline-none transition duration-200 disabled:opacity-50 font-medium"
            >
              {deleting ? "Deleting..." : "Yes, Delete Product"}
            </button>
            <button
              onClick={() => navigate("/products")}
              disabled={deleting}
              className="bg-gray-300 text-gray-800 py-2 px-6 rounded-md hover:bg-gray-400 focus:outline-none transition duration-200 disabled:opacity-50 font-medium"
            >
              Cancel
            </button>
          </div>
        </div>
        <ToastContainer position="top-right" autoClose={2000} />
      </div>
    </div>
  );
};

export default DeleteProduct;

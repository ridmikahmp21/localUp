import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";
import Sidebar from "../../components/navbarSeller/Sidebar";
import Header from "../../components/navbarSeller/Header";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const EditProduct = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  const [productName, setProductName] = useState("");
  const [description, setDescription] = useState("");
  const [originalPrice, setOriginalPrice] = useState("");
  const [quantity, setQuantity] = useState("");
  const [category, setCategory] = useState("");
  const [status, setStatus] = useState("");
  const [mainImage, setMainImage] = useState(null);
  const [mainPreview, setMainPreview] = useState(null);
  const [sampleImages, setSampleImages] = useState([]);
  const [samplePreviews, setSamplePreviews] = useState([]);
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    const fetchProduct = async () => {
      try {
        const { data } = await axios.get(
          `http://localhost:5000/api/products/${id}`
        );
        setProductName(data.name || "");
        setDescription(data.description || "");
        setOriginalPrice(data.price || "");
        setQuantity(data.quantity?.toString() || "");
        setCategory(data.category || "");
        setStatus(data.status || "");

        if (data.image) {
          setMainPreview(`http://localhost:5000/uploads/${data.image}`);
        }

        if (data.images?.length) {
          const previews = data.images.map(
            (img) => `http://localhost:5000/uploads/${img}`
          );
          setSamplePreviews(previews);
        }
      } catch (err) {
        console.error("Error fetching product:", err);
        toast.error("Failed to load product details.");
        setErrors({ fetch: "Failed to load product details." });
      } finally {
        setLoading(false);
      }
    };
    fetchProduct();
  }, [id]);

  useEffect(() => {
    const qty = Number(quantity);
    if (qty === 0 && status !== "Out of Stock") {
      setStatus("Out of Stock");
    } else if (qty > 0 && status !== "In Stock") {
      setStatus("In Stock");
    }
  }, [quantity, status]);

  useEffect(() => {
    if (status === "Out of Stock" && Number(quantity) !== 0) {
      setQuantity("0");
    }
  }, [status, quantity]);

  const handleMainImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setMainImage(file);
      setMainPreview(URL.createObjectURL(file));
    }
  };

  const handleSampleImagesChange = (e) => {
    const files = Array.from(e.target.files);
    setSampleImages(files);
    setSamplePreviews(files.map((file) => URL.createObjectURL(file)));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const newErrors = {};

    if (!productName.trim())
      newErrors.productName = "Product name is required.";
    if (!category) newErrors.category = "Category is required.";
    if (!status) newErrors.status = "Status is required.";
    if (!originalPrice || isNaN(originalPrice) || Number(originalPrice) <= 0) {
      newErrors.originalPrice = "Enter a valid price.";
    }
    if (!quantity || isNaN(quantity) || Number(quantity) < 0) {
      newErrors.quantity = "Enter a valid quantity.";
    }
    if (!description.trim()) newErrors.description = "Description is required.";
    if (!mainPreview && !mainImage) {
      newErrors.mainImage = "Main product image is required.";
    }

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    try {
      setSubmitting(true);
      const formData = new FormData();
      formData.append("name", productName);
      formData.append("description", description);
      formData.append("price", originalPrice);
      formData.append("quantity", quantity);
      formData.append("category", category);
      formData.append("status", status);
      if (mainImage) formData.append("image", mainImage);
      sampleImages.forEach((file) => formData.append("images", file));

      await axios.put(`http://localhost:5000/api/products/${id}`, formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });

      toast.success("Product updated successfully!", {
        autoClose: 2000,
        onClose: () => navigate("/products"),
      });
    } catch (err) {
      console.error("Error updating product:", err);
      toast.error(
        err.response?.data?.message ||
          "Failed to update product. Please try again."
      );
      setErrors({
        submit:
          err.response?.data?.message ||
          "Failed to update product. Please try again.",
      });
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <p className="text-gray-600 text-base">Loading product details...</p>
      </div>
    );
  }

  return (
    <div className="flex">
      <Sidebar />
      <div className="flex-1 bg-gray-50 min-h-screen p-8">
        <Header />
        <div className="w-full bg-white rounded-md shadow-md p-6 mt-6">
          <h2 className="text-xl font-semibold text-gray-800 mb-6">
            Edit Product
          </h2>

          <form
            onSubmit={handleSubmit}
            className="space-y-6"
            encType="multipart/form-data"
          >
            {/* Product Name */}
            <div>
              <label className="block text-sm font-medium text-gray-700">
                Product Name
              </label>
              <input
                type="text"
                value={productName}
                onChange={(e) => setProductName(e.target.value)}
                className="mt-1 block w-full border border-gray-300 rounded-md p-2"
                placeholder="Enter product name"
              />
              {errors.productName && (
                <p className="text-red-500 text-sm mt-1">
                  {errors.productName}
                </p>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700">
                Category
              </label>
              <select
                value={category}
                onChange={(e) => setCategory(e.target.value)}
                className="mt-1 block w-full border border-gray-300 rounded-md p-2"
              >
                <option value="">Select a category</option>
                <option value="Beauty & Skincare">Beauty & Skincare</option>
                <option value="Home & Living">Home & Living</option>
                <option value="Fashion & Apparel">Fashion & Apparel</option>
                <option value="Food & Beverages">Food & Beverages</option>
                <option value="Health Products">Health Products</option>
                <option value="Accessories">Accessories</option>
                <option value="Handicrafts">Handicrafts</option>
                <option value="Luxury & Lifestyle">Luxury & Lifestyle</option>
                <option value="Books & Stationery">Books & Stationery</option>
              </select>
              {errors.category && (
                <p className="text-red-500 text-sm mt-1">{errors.category}</p>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700">
                Status
              </label>
              <select
                value={status}
                onChange={(e) => setStatus(e.target.value)}
                className="mt-1 block w-full border border-gray-300 rounded-md p-2"
              >
                <option value="">Select status</option>
                <option value="In Stock">In Stock</option>
                <option value="Out of Stock">Out of Stock</option>
              </select>
              {errors.status && (
                <p className="text-red-500 text-sm mt-1">{errors.status}</p>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700">
                Price
              </label>
              <input
                type="number"
                min="0"
                step="0.01"
                value={originalPrice}
                onChange={(e) => setOriginalPrice(e.target.value)}
                className="mt-1 block w-full border border-gray-300 rounded-md p-2"
                placeholder="Enter price"
              />
              {errors.originalPrice && (
                <p className="text-red-500 text-sm mt-1">
                  {errors.originalPrice}
                </p>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700">
                Quantity
              </label>
              <input
                type="number"
                min="0"
                value={quantity}
                onChange={(e) => setQuantity(e.target.value)}
                className="mt-1 block w-full border border-gray-300 rounded-md p-2"
                placeholder="Enter quantity"
              />
              {errors.quantity && (
                <p className="text-red-500 text-sm mt-1">{errors.quantity}</p>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700">
                Description
              </label>
              <textarea
                rows="4"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                className="mt-1 block w-full border border-gray-300 rounded-md p-2"
                placeholder="Enter description"
              />
              {errors.description && (
                <p className="text-red-500 text-sm mt-1">
                  {errors.description}
                </p>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700">
                Main Image
              </label>
              {mainPreview && (
                <div className="mt-4 w-24 h-24 rounded-md overflow-hidden border border-gray-300">
                  <img
                    src={mainPreview}
                    alt="Main Preview"
                    className="w-full h-full object-cover"
                  />
                </div>
              )}
              <input
                type="file"
                name="image"
                accept="image/*"
                onChange={handleMainImageChange}
                className="mt-2"
              />
              {errors.mainImage && (
                <p className="text-red-500 text-sm mt-1">{errors.mainImage}</p>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700">
                Sample Images
              </label>
              <input
                type="file"
                multiple
                accept="image/*"
                onChange={handleSampleImagesChange}
                className="mt-2 block w-full text-sm text-gray-700"
              />
              <div className="mt-4 grid grid-cols-4 gap-4">
                {samplePreviews.map((src, idx) => (
                  <div
                    key={idx}
                    className="relative w-24 h-24 rounded-md overflow-hidden border border-gray-300"
                  >
                    <img
                      src={src}
                      alt={`Sample ${idx + 1}`}
                      className="w-full h-full object-cover"
                    />
                    <button
                      type="button"
                      className="absolute top-0 right-0 bg-gray-200 text-gray-700 rounded-full p-1 hover:bg-gray-300 focus:outline-none text-xs"
                      onClick={() => {
                        const updatedFiles = [...sampleImages];
                        const updatedPreviews = [...samplePreviews];
                        updatedFiles.splice(idx, 1);
                        updatedPreviews.splice(idx, 1);
                        setSampleImages(updatedFiles);
                        setSamplePreviews(updatedPreviews);
                      }}
                    >
                      ×
                    </button>
                  </div>
                ))}
              </div>
            </div>

            <div className="flex justify-end">
              <button
                type="submit"
                disabled={submitting}
                className="bg-gray-800 text-white py-2 px-6 rounded-md hover:bg-gray-900 focus:outline-none transition duration-200 disabled:opacity-50 font-medium"
              >
                {submitting ? "Updating..." : "Update Product"}
              </button>
            </div>

            {errors.submit && (
              <p className="text-red-500 text-sm mt-4 text-right">
                {errors.submit}
              </p>
            )}
          </form>
        </div>

        <ToastContainer position="top-right" autoClose={2000} />
      </div>
    </div>
  );
};

export default EditProduct;

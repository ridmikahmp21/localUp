import React, { useState } from "react";
import axios from "axios";
import Sidebar from "../../components/navbarSeller/Sidebar";
import Header from "../../components/navbarSeller/Header";
import { toast, ToastContainer } from "react-toastify";
import { useNavigate } from "react-router-dom";
import "react-toastify/dist/ReactToastify.css";

const AddProduct = () => {
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
  const [submitting, setSubmitting] = useState(false);
  const navigate = useNavigate();

  const handleMainImageChange = (event) => {
    const file = event.target.files[0];
    if (file) {
      setMainImage(file);
      setMainPreview(URL.createObjectURL(file));
    } else {
      setMainImage(null);
      setMainPreview(null);
    }
  };

  const handleSampleImagesChange = (event) => {
    const files = Array.from(event.target.files);
    setSampleImages(files);
    setSamplePreviews(files.map((file) => URL.createObjectURL(file)));
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    const newErrors = {};

    if (!productName.trim())
      newErrors.productName = "Product name is required.";
    if (!category) newErrors.category = "Please select a category.";
    if (!status) newErrors.status = "Please select the product status.";
    if (!originalPrice || isNaN(originalPrice) || Number(originalPrice) <= 0) {
      newErrors.originalPrice = "Enter a valid price.";
    }
    if (
      !quantity ||
      isNaN(quantity) ||
      Number(quantity) <= 0 ||
      !Number.isInteger(Number(quantity))
    ) {
      newErrors.quantity = "Enter a valid quantity.";
    }
    if (!description.trim()) newErrors.description = "Description is required.";
    if (!mainImage) newErrors.mainImage = "Main product image is required.";

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
      formData.append("image", mainImage);
      sampleImages.forEach((file) => formData.append("images", file));

      await axios.post("http://localhost:5000/api/products", formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });

      toast.success("Product added successfully!", {
        autoClose: 1500,
        onClose: () => navigate("/products", { state: { success: true } }),
      });

      // Reset form
      setProductName("");
      setDescription("");
      setOriginalPrice("");
      setQuantity("");
      setCategory("");
      setStatus("");
      setMainImage(null);
      setMainPreview(null);
      setSampleImages([]);
      setSamplePreviews([]);
      setErrors({});
    } catch (error) {
      console.error(
        "Error adding product:",
        error.response?.data || error.message
      );
      toast.error(
        error.response?.data?.message ||
          "Failed to add product. Please try again."
      );
      setErrors({
        submit:
          error.response?.data?.message ||
          "Failed to add product. Please try again.",
      });
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="flex">
      <Sidebar />
      <div className="flex-1 bg-gray-50 min-h-screen p-8">
        <Header />
        <div className="w-full bg-white rounded-md shadow-md p-6 mt-6">
          <h2 className="text-xl font-semibold text-gray-800 mb-6">
            Add Product
          </h2>
          <form
            onSubmit={handleSubmit}
            className="space-y-6"
            encType="multipart/form-data"
          >
            {" "}
            <div>
              <label className="block text-sm font-medium text-gray-700">
                Product Name
              </label>
              <input
                type="text"
                className="mt-1 block w-full border border-gray-300 rounded-md p-2"
                value={productName}
                onChange={(e) => setProductName(e.target.value)}
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
                className="mt-1 block w-full border border-gray-300 rounded-md p-2"
                value={category}
                onChange={(e) => setCategory(e.target.value)}
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
                className="mt-1 block w-full border border-gray-300 rounded-md p-2"
                value={status}
                onChange={(e) => setStatus(e.target.value)}
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
                className="mt-1 block w-full border border-gray-300 rounded-md p-2"
                value={originalPrice}
                onChange={(e) => setOriginalPrice(e.target.value)}
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
                min="1"
                className="mt-1 block w-full border border-gray-300 rounded-md p-2"
                value={quantity}
                onChange={(e) => setQuantity(e.target.value)}
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
                className="mt-1 block w-full border border-gray-300 rounded-md p-2"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="Enter description"
              ></textarea>
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
              <input
                type="file"
                name="image"
                accept="image/*"
                onChange={handleMainImageChange}
                className="mt-2"
              />
              {mainPreview && (
                <div className="mt-4 w-24 h-24 rounded-md overflow-hidden border border-gray-300">
                  <img
                    src={mainPreview}
                    alt="Main Preview"
                    className="w-full h-full object-cover"
                  />
                </div>
              )}
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
                accept="image/*"
                multiple
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
                {submitting ? "Adding..." : "Add Product"}
              </button>
            </div>
            {/* Submit Error */}
            {errors.submit && (
              <p className="text-red-500 text-sm mt-4 text-right">
                {errors.submit}
              </p>
            )}
          </form>
        </div>
        <ToastContainer position="top-right" autoClose={1500} />
      </div>
    </div>
  );
};

export default AddProduct;

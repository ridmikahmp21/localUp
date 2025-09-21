import React, { useState, useEffect } from "react";
import { useParams, Link, useNavigate } from "react-router-dom";
import axios from "axios";
import { useCart } from "../../context/CartContext";
import HelpCenter from "../../components/HelpCenter";
import { toast } from "react-toastify";

const ProductDetails = () => {
  const { productId } = useParams();
  const navigate = useNavigate();
  const { addToCart } = useCart();
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [selectedImage, setSelectedImage] = useState(0);
  const [quantity, setQuantity] = useState(1);

  useEffect(() => {
    const fetchProductDetails = async () => {
      try {
        const res = await axios.get(
          `http://localhost:5000/api/products/${productId}`
        );
        console.log("Fetched product data:", res.data);
        setProduct(res.data);
      } catch (err) {
        console.error("Error fetching product details:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchProductDetails();
  }, [productId]);

  const getProductImages = () => {
    if (!product) return [];
    const images = new Set();
    if (product.image)
      images.add(`http://localhost:5000/uploads/${product.image}`);
    if (product.images && Array.isArray(product.images)) {
      product.images.forEach((img) => {
        if (img) images.add(`http://localhost:5000/uploads/${img}`);
      });
    }
    return Array.from(images);
  };

  const productImages = getProductImages();
  const displayImages =
    productImages.length > 0
      ? productImages
      : ["https://via.placeholder.com/500x500?text=No+Image+Available"];

  const handleAddToCart = async () => {
    const token = localStorage.getItem("token");
    if (!token) {
      toast.error("Please sign in to add items to your cart.");
      navigate("/signIn");
      return;
    }

    if (product.quantity === 0) {
      toast.error("This product is out of stock!");
      return;
    }

    if (quantity > product.quantity) {
      toast.error(`Only ${product.quantity} in stock. Please reduce quantity.`);
      return;
    }

    try {
      await addToCart(product, quantity);
    } catch (err) {
      if (!err.response || err.response.status !== 409) {
        toast.error(err.response?.data?.message || "Failed to add to cart.");
      }
    }
  };

  const calculateAverageRating = (reviews) => {
    if (!reviews || reviews.length === 0) return 0;
    const sum = reviews.reduce((acc, review) => acc + review.rating, 0);
    return sum / reviews.length;
  };

  const renderStarRating = (rating, size = "md") => {
    const starSize = size === "md" ? "w-5 h-5" : "w-4 h-4";
    return (
      <div className="flex">
        {[...Array(5)].map((_, starIdx) => (
          <svg
            key={starIdx}
            className={`${starSize} ${
              starIdx < rating ? "text-yellow-400" : "text-gray-300"
            }`}
            fill="currentColor"
            viewBox="0 0 20 20"
          >
            <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
          </svg>
        ))}
      </div>
    );
  };

  const formatReviewerName = (name) => {
    if (!name) return "Anonymous";

    const nameParts = name.trim().split(" ");
    if (nameParts.length === 1) {
      const firstChar = nameParts[0].charAt(0);
      const lastChar = nameParts[0].charAt(nameParts[0].length - 1);
      return `${firstChar}***${lastChar}`;
    } else {
      const firstName = nameParts[0];
      const lastName = nameParts[nameParts.length - 1];
      const firstChar = firstName.charAt(0);
      const lastChar = lastName.charAt(lastName.length - 1);
      return `${firstChar}***${lastChar}`;
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-gray-900"></div>
      </div>
    );
  }

  if (!product) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">
            Product Not Found
          </h2>
          <Link to="/" className="text-blue-600 hover:text-blue-800">
            Return to Home
          </Link>
        </div>
      </div>
    );
  }

  const averageRating = calculateAverageRating(product.reviews);
  const reviewCount = product.reviews?.length || 0;

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <nav className="flex mb-6" aria-label="Breadcrumb">
          <ol className="flex items-center space-x-2">
            <li>
              <Link
                to="/home"
                className="text-gray-500 hover:text-gray-700 text-sm"
              >
                Home
              </Link>
            </li>
            <li>
              <svg
                className="flex-shrink-0 h-5 w-5 text-gray-400"
                xmlns="http://www.w3.org/2000/svg"
                fill="currentColor"
                viewBox="0 0 20 20"
                aria-hidden="true"
              >
                <path d="M5.555 17.776l8-16 .894.448-8 16-.894-.448z" />
              </svg>
            </li>
            <li>
              <Link
                to={`/category/${product.category}`}
                className="text-gray-500 hover:text-gray-700 text-sm capitalize"
              >
                {product.category}
              </Link>
            </li>
            <li>
              <svg
                className="flex-shrink-0 h-5 w-5 text-gray-400"
                xmlns="http://www.w3.org/2000/svg"
                fill="currentColor"
                viewBox="0 0 20 20"
                aria-hidden="true"
              >
                <path d="M5.555 17.776l8-16 .894.448-8 16-.894-.448z" />
              </svg>
            </li>
            <li>
              <span className="text-gray-700 text-sm font-medium">
                {product.name}
              </span>
            </li>
          </ol>
        </nav>

        <div className="bg-white rounded-xl shadow-sm overflow-hidden">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 p-6">
            <div className="space-y-4">
              <div className="w-full h-96 bg-gray-100 rounded-lg overflow-hidden flex items-center justify-center">
                <img
                  src={displayImages[selectedImage]}
                  alt={product.name}
                  className="w-full h-full object-contain"
                  onError={(e) => {
                    e.target.src =
                      "https://via.placeholder.com/500x500?text=Image+Not+Found";
                  }}
                />
              </div>

              {displayImages.length > 1 && (
                <div className="grid grid-cols-4 gap-4">
                  {displayImages.map((img, index) => (
                    <button
                      key={index}
                      onClick={() => setSelectedImage(index)}
                      className={`w-20 h-20 bg-gray-100 rounded-md overflow-hidden flex items-center justify-center ${
                        selectedImage === index ? "ring-2 ring-blue-500" : ""
                      }`}
                    >
                      <img
                        src={img}
                        alt={`${product.name} view ${index + 1}`}
                        className="w-full h-full object-contain"
                        onError={(e) => {
                          e.target.src =
                            "https://via.placeholder.com/80x80?text=Error";
                        }}
                      />
                    </button>
                  ))}
                </div>
              )}
            </div>

            <div className="space-y-6">
              <div>
                <h1 className="text-3xl font-bold text-gray-900">
                  {product.name}
                </h1>
                <p className="text-2xl font-semibold text-gray-900 mt-2">
                  ${Number(product.price).toFixed(2)}
                </p>
              </div>

              <div className="flex items-center">
                {renderStarRating(Math.round(averageRating))}
                <span className="ml-2 text-sm text-gray-500">
                  ({reviewCount} customer reviews)
                </span>
              </div>

              {product.quantity === 0 ? (
                <div className="p-3 bg-red-50 rounded-lg border border-red-100">
                  <span className="text-red-700 font-medium flex items-center">
                    <svg
                      className="w-5 h-5 mr-2"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                      />
                    </svg>
                    Out of Stock
                  </span>
                </div>
              ) : product.quantity <= 5 ? (
                <div className="p-3 bg-amber-50 rounded-lg border border-amber-100">
                  <div className="flex justify-between items-center mb-2">
                    <span className="text-amber-700 font-medium flex items-center">
                      <svg
                        className="w-5 h-5 mr-2"
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
                      Low Stock
                    </span>
                    <span className="text-amber-700 text-sm font-semibold">
                      Only {product.quantity} left
                    </span>
                  </div>
                  <div className="w-full bg-amber-200 rounded-full h-2">
                    <div
                      className="bg-amber-500 h-2 rounded-full"
                      style={{ width: `${(product.quantity / 5) * 100}%` }}
                    ></div>
                  </div>
                </div>
              ) : (
                <div className="p-3 bg-green-50 rounded-lg border border-green-100">
                  <span className="text-green-700 font-medium flex items-center">
                    <svg
                      className="w-5 h-5 mr-2"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M5 13l4 4L19 7"
                      />
                    </svg>
                    In Stock
                  </span>
                </div>
              )}

              <div>
                <h2 className="text-lg font-medium text-gray-900 mb-2">
                  Description
                </h2>
                <p className="text-gray-600">{product.description}</p>
              </div>

              <div>
                <label
                  htmlFor="quantity"
                  className="block text-sm font-medium text-gray-700 mb-2"
                >
                  Quantity
                </label>
                <div className="flex items-center">
                  <button
                    onClick={() => quantity > 1 && setQuantity(quantity - 1)}
                    className="p-2 rounded-md border border-gray-300 text-gray-600 hover:bg-gray-100"
                    disabled={quantity <= 1}
                  >
                    <svg
                      className="w-5 h-5"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M20 12H4"
                      />
                    </svg>
                  </button>
                  <input
                    type="number"
                    id="quantity"
                    min="1"
                    max={product.quantity}
                    value={quantity}
                    onChange={(e) => {
                      const value = Math.max(
                        1,
                        Math.min(product.quantity, Number(e.target.value))
                      );
                      setQuantity(value);
                    }}
                    className="mx-2 w-16 text-center border border-gray-300 rounded-md py-2 px-3 text-gray-900"
                  />
                  <button
                    onClick={() =>
                      quantity < product.quantity && setQuantity(quantity + 1)
                    }
                    className="p-2 rounded-md border border-gray-300 text-gray-600 hover:bg-gray-100"
                    disabled={quantity >= product.quantity}
                  >
                    <svg
                      className="w-5 h-5"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M12 6v6m0 0v6m0-6h6m-6 0H6"
                      />
                    </svg>
                  </button>
                </div>
              </div>

              <div className="flex space-x-4 pt-4">
                <Link
                  to="/checkout"
                  className="w-full py-3 bg-gray-800 text-white rounded-lg hover:bg-black transition-colors duration-300 flex items-center justify-center shadow-md hover:shadow-lg"
                >
                  Proceed to Checkout
                  <svg
                    className="w-5 h-5 ml-2"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M17 8l4 4m0 0l-4 4m4-4H3"
                    />
                  </svg>
                </Link>
                <button
                  onClick={handleAddToCart}
                  disabled={product.quantity === 0}
                  title={
                    product.quantity === 0 ? "Out of Stock" : "Add to Cart"
                  }
                  className={`flex items-center justify-center py-3 px-6 rounded-lg border font-medium text-sm transition-colors duration-300
    ${
      product.quantity === 0
        ? "border-gray-300 text-gray-400 bg-gray-100 cursor-not-allowed"
        : "border-gray-300 text-gray-700 hover:bg-gray-50"
    }`}
                >
                  <svg
                    className="w-5 h-5 mr-2"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z"
                    />
                  </svg>
                  Add to Cart
                </button>
              </div>

              <div className="border-t border-gray-200 pt-4">
                <div className="grid grid-cols-2 gap-4 text-sm text-gray-600">
                  <div>
                    <span className="font-medium text-gray-900">Category:</span>{" "}
                    {product.category}
                  </div>
                  <div>
                    <span className="font-medium text-gray-900">SKU:</span>{" "}
                    {product._id?.slice(-8).toUpperCase() || "N/A"}
                  </div>
                  <div>
                    <span className="font-medium text-gray-900">Delivery:</span>{" "}
                    Free shipping
                  </div>
                  <div>
                    <span className="font-medium text-gray-900">
                      Return Policy:
                    </span>{" "}
                    30 days returnable
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="mt-8 bg-white rounded-xl shadow-sm overflow-hidden">
          <div className="p-6">
            <h2 className="text-2xl font-bold text-gray-900 mb-6">
              Customer Reviews
            </h2>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
              <div className="lg:col-span-1">
                <div className="bg-gray-50 p-6 rounded-lg">
                  <div className="text-center mb-4">
                    <div className="text-5xl font-bold text-gray-900">
                      {averageRating.toFixed(1)}
                    </div>
                    <div className="mt-2 flex justify-center">
                      {renderStarRating(Math.round(averageRating))}
                    </div>
                    <div className="text-sm text-gray-600 mt-1">
                      Based on {reviewCount} reviews
                    </div>
                  </div>
                </div>
              </div>

              <div className="lg:col-span-2">
                {reviewCount > 0 ? (
                  <div className="space-y-6">
                    {product.reviews.map((review, index) => (
                      <div
                        key={index}
                        className="border-b border-gray-200 pb-6 last:border-0"
                      >
                        <div className="flex justify-between items-start">
                          <div>
                            <div className="flex items-center mt-1">
                              {renderStarRating(review.rating, "sm")}
                              <span className="ml-2 text-sm text-gray-500">
                                {new Date(
                                  review.date || Date.now()
                                ).toLocaleDateString()}
                              </span>
                            </div>
                          </div>
                          <div className="text-sm text-gray-500">
                            by {formatReviewerName(review.buyerUsername)}
                          </div>
                        </div>

                        {review.comment && (
                          <p className="mt-3 text-gray-700">{review.comment}</p>
                        )}

                        <div className="mt-4 flex items-center space-x-4">
                          <button className="text-sm text-gray-500 hover:text-gray-700 flex items-center">
                            <svg
                              className="w-4 h-4 mr-1"
                              fill="none"
                              stroke="currentColor"
                              viewBox="0 0 24 24"
                            >
                              <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth={2}
                                d="M14 10h4.764a2 2 0 011.789 2.894l-3.5 7A2 2 0 0115.263 21h-4.017c-.163 0-.326-.02-.485-.06L7 20m7-10V5a2 2 0 00-2-2h-.095c-.5 0-.905.405-.905.905a3.61 3.61 0 01-.608 2.006L7 11v9m7-10h-2M7 20H5a2 2 0 01-2-2v-6a2 2 0 012-2h2.5"
                              />
                            </svg>
                            Helpful ({review.helpful || 0})
                          </button>
                          <button className="text-sm text-gray-500 hover:text-gray-700 flex items-center">
                            <svg
                              className="w-4 h-4 mr-1"
                              fill="none"
                              stroke="currentColor"
                              viewBox="0 0 24 24"
                            >
                              <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth={2}
                                d="M10 14H5.236a2 2 0 01-1.789-2.894l3.5-7A2 2 0 018.736 3h4.018a2 2 0 01.485.06l3.76.94m-7 10v5a2 2 0 002 2h.096c.5 0 .905-.405.905-.904 0-.715.211-1.413.608-2.008L17 13V4m-7 10h2m5-10h2a2 2 0 012 2v6a2 2 0 01-2 2h-2.5"
                              />
                            </svg>
                            Not Helpful ({review.notHelpful || 0})
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-10">
                    <svg
                      className="w-16 h-16 mx-auto text-gray-300"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z"
                      />
                    </svg>
                    <h3 className="mt-4 text-lg font-medium text-gray-900">
                      No reviews yet
                    </h3>
                    <p className="mt-2 text-gray-500">
                      Be the first to share your thoughts about this product!
                    </p>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
      <HelpCenter />
    </div>
  );
};

export default ProductDetails;

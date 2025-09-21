import React, { useEffect, useState } from "react";
import Navbar from "../../components/navbarBuyer/Navbar";
import { Link } from "react-router-dom";
import axios from "axios";
import { useCart } from "../../context/CartContext";
import HelpCenter from "../../components/HelpCenter";
import { toast } from "react-toastify";
import home1 from "../../assets/home1.jpg";
import home3 from "../../assets/home3.jpg";
import cat1 from "../../assets/cat-1.jpg";
import cat2 from "../../assets/cat-2.jpg";
import cat3 from "../../assets/cat-3.jpg";
import cat4 from "../../assets/cat-4.jpg";
import cat5 from "../../assets/cat-5.jpg";
import cat6 from "../../assets/cat-6.jpg";
import cat7 from "../../assets/cat-7.jpg";
import cat8 from "../../assets/cat-8.jpg";
import cat9 from "../../assets/cat-9.jpg";
import featured1 from "../../assets/feature1.jpg";
import featured2 from "../../assets/feature2.jpg";
import featured3 from "../../assets/cat-6.jpg";
import featured4 from "../../assets/left-banner.jpeg";

export default function HomePage() {
  const categories = [
    "Fashion & Apparel",
    "Beauty & Skincare",
    "Home & Living",
    "Food & Beverages",
    "Health Products",
    "Accessories",
    "Handicrafts",
    "Luxury & Lifestyle",
    "Books & Stationery",
  ];

  const catImages = [cat1, cat2, cat3, cat4, cat5, cat6, cat7, cat8, cat9];

  const featuredProductsData = [
    {
      label: "New Arrival",
      description: "Black and White version of the PS5 coming out on sale.",
      image: featured1,
      link: "#",
    },
    {
      label: "Best Selling",
      description: "Featured woman collections that give you another vibe.",
      image: featured2,
      link: "#",
    },
    {
      label: "Local Favourites",
      description: "Amazon wireless speakers.",
      image: featured3,
      link: "#",
    },
    {
      label: "Exclusive",
      description: "GUCCI INTENSE OUD EDP UNISEX",
      image: featured4,
      link: "#",
    },
  ];

  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const { addToCart } = useCart();

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const res = await axios.get("http://localhost:5000/api/products");
        setProducts(res.data);
        setLoading(false);
      } catch (err) {
        setError("Failed to load products. Please try again.");
        setLoading(false);
      }
    };

    fetchProducts();
  }, []);

  const renderStockStatus = (quantity) => {
    if (quantity === 0) {
      return (
        <span className="px-2 py-1 bg-red-100 text-red-600 rounded-full text-xs font-medium">
          Out of Stock
        </span>
      );
    } else if (quantity <= 5) {
      return (
        <span className="px-2 py-1 bg-amber-100 text-amber-600 rounded-full text-xs font-medium">
          Low Stock
        </span>
      );
    } else {
      return (
        <span className="px-2 py-1 bg-green-100 text-green-600 rounded-full text-xs font-medium">
          In Stock
        </span>
      );
    }
  };

  return (
    <div className="font-sans bg-gray-50">
      <div className="fixed top-0 left-0 w-full z-50">
        <Navbar />
      </div>
      <div className="pt-20"></div>

      <div className="h-[80vh] flex justify-between items-center px-8 py-6 bg-gradient-to-br from-gray-50 to-gray-100">
        <div className="relative h-full w-1/3 rounded-xl overflow-hidden group">
          <img
            src={home1}
            alt="Banner Left"
            className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-end justify-center pb-6"></div>
        </div>

        <div className="text-center px-8">
          <div className="relative rounded-xl overflow-hidden group mb-4">
            <img
              src={home1}
              alt="top banner"
              className="w-full h-36 object-cover transition-transform duration-500 group-hover:scale-105"
            />
            <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
          </div>

          <h1 className="text-5xl font-bold mt-7 bg-gradient-to-r from-black to-gray-600 bg-clip-text text-transparent">
            ULTIMATE SALE
          </h1>
          <p className="text-lg mt-4 text-gray-600">NEW COLLECTION</p>
          <button className="mt-6 px-8 py-3 bg-black text-white rounded-lg hover:bg-gray-900 transition-all duration-300 transform hover:-translate-y-1">
            SHOP NOW
          </button>

          <div className="relative rounded-xl overflow-hidden group mt-4">
            <img
              src={home1}
              alt="Bottom banner"
              className="w-full h-36 object-cover transition-transform duration-500 group-hover:scale-105"
            />
            <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
          </div>
        </div>

        <div className="relative h-full w-1/3 rounded-xl overflow-hidden group">
          <img
            src={home3}
            alt="Banner Right"
            className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-end justify-center pb-6"></div>
        </div>
      </div>

      <div className="bg-gray-950 text-white text-center py-8">
        <h2 className="text-2xl font-semibold">Up to 10% off Voucher</h2>
        <p className="text-gray-300 mt-2">On your first purchase</p>
      </div>

      <div className="px-4 pt-16 bg-white">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-2xl font-bold text-gray-700 mb-2">
              Product Categories
            </h2>
            <h3 className="text-4xl font-bold text-gray-900">
              Shop by Categories
            </h3>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
            {categories.map((category, idx) => (
              <Link to={`/category/${encodeURIComponent(category)}`} key={idx}>
                <div className="group relative overflow-hidden rounded-xl bg-gray-800 transition-all duration-500 hover:shadow-2xl hover:-translate-y-2 w-full max-w-sm mx-auto">
                  <div className="relative h-52 overflow-hidden">
                    <img
                      src={catImages[idx]}
                      alt={category}
                      className="w-full h-full object-cover transition-all duration-700 group-hover:scale-110"
                    />

                    <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/30 to-transparent"></div>

                    <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/5 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-1000"></div>
                  </div>

                  <div className="p-5 bg-white">
                    <div className="flex items-center justify-between">
                      <h3 className="text-xl font-semibold text-gray-800 group-hover:text-gray-900 transition-colors line-clamp-1">
                        {category}
                      </h3>

                      <div className="w-10 h-10 bg-gray-800 text-white rounded-full flex items-center justify-center group-hover:bg-gray-900 transition-colors shadow-md hover:shadow-lg">
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
                            d="M9 5l7 7-7 7"
                          />
                        </svg>
                      </div>
                    </div>

                    <p className="text-base text-gray-500 mt-1">
                      Discover the unique product category
                    </p>
                  </div>
                  <div className="absolute inset-0 border-2 border-transparent group-hover:border-gray-800/10 transition-all duration-300 rounded-xl"></div>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </div>

      <div className="px-6 pb-14 bg-white">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-2xl font-bold text-gray-700 mb-2">
              Our Products
            </h2>
            <h3 className="text-4xl font-bold text-gray-900">
              Featured Collection
            </h3>
          </div>

          {loading ? (
            <div className="flex justify-center items-center py-20">
              <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-gray-800"></div>
            </div>
          ) : error ? (
            <p className="text-red-500 text-center">{error}</p>
          ) : products.length === 0 ? (
            <p className="text-gray-600 text-center">
              No products available right now.
            </p>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
              {products.map((product) => (
                <div
                  key={product._id}
                  className="bg-white rounded-xl shadow-md overflow-hidden transition-all duration-300 hover:shadow-xl hover:-translate-y-1 border border-gray-200"
                >
                  <div className="relative">
                    <img
                      src={
                        product.image
                          ? `http://localhost:5000/uploads/${product.image}`
                          : "https://via.placeholder.com/300x200?text=No+Image"
                      }
                      alt={product.name}
                      className="w-full h-48 object-cover transition-transform duration-300 hover:scale-105"
                    />
                  </div>

                  <div className="p-4 space-y-3">
                    <h3 className="text-lg font-semibold text-gray-800 line-clamp-1">
                      {product.name}
                    </h3>

                    <div className="flex justify-between items-center">
                      <p className="text-sm text-gray-600 line-clamp-1 flex-1 mr-2">
                        {product.description}
                      </p>
                      {renderStockStatus(product.quantity)}
                    </div>

                    <div className="flex items-center justify-between">
                      <div className="flex items-center">
                        <div className="flex">
                          {[...Array(5)].map((_, starIdx) => (
                            <svg
                              key={starIdx}
                              className={`w-4 h-4 ${
                                starIdx < 4
                                  ? "text-yellow-400"
                                  : "text-gray-300"
                              }`}
                              fill="currentColor"
                              viewBox="0 0 20 20"
                            >
                              <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                            </svg>
                          ))}
                        </div>
                        <span className="text-xs text-gray-500 ml-1">
                          (1.4k)
                        </span>
                      </div>
                      <span className="text-lg font-bold text-gray-900">
                        LKR {Number(product.price).toFixed(2)}
                      </span>
                    </div>

                    <div className="flex space-x-2 pt-2">
                      <Link
                        to={`/product/${product._id}`}
                        className="flex-1 bg-gray-950 text-white py-2 px-4 rounded-lg text-center text-sm font-medium hover:bg-gray-900 transition-colors duration-300"
                      >
                        View Details
                      </Link>
                      <button
                        onClick={() => {
                          const token = localStorage.getItem("token");
                          if (!token) {
                            toast.error(
                              "Please sign in to add items to your cart."
                            );
                            return;
                          }
                          if (product.quantity === 0) {
                            toast.error("This product is out of stock!");
                            return;
                          }
                          addToCart(product, 1).catch((err) => {
                            if (err.response?.status !== 409) {
                              toast.error(
                                err.response?.data?.message ||
                                  "Failed to add to cart."
                              );
                            }
                          });
                        }}
                        disabled={product.quantity === 0}
                        title={
                          product.quantity === 0
                            ? "Out of Stock"
                            : "Add to Cart"
                        }
                        className={`p-2 rounded-lg transition-colors duration-300 flex items-center justify-center w-10
    ${
      product.quantity === 0
        ? "bg-gray-300 cursor-not-allowed"
        : "bg-gray-100 hover:bg-gray-200"
    }`}
                      >
                        <svg
                          className="w-5 h-5 text-gray-600"
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
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      <div className="px-8 py-16 bg-gray-100">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-10">
            <h2 className="text-3xl font-bold text-gray-800">
              Featured Products
            </h2>
            <h2 className="text-xl text-gray-600 mt-2">
              Handpicked Excellence
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {featuredProductsData.map((product, idx) => (
              <div
                key={idx}
                className="bg-gray-900 rounded-2xl overflow-hidden relative group transition-all duration-300 hover:shadow-2xl"
              >
                <img
                  src={product.image}
                  alt={product.label}
                  className="w-full h-80 object-cover opacity-90 transition-all duration-500 group-hover:opacity-80 group-hover:scale-105"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/40 to-transparent"></div>
                <div className="absolute bottom-8 left-8 text-white">
                  <h3 className="font-bold text-3xl mb-3 group-hover:text-gray-200 transition-colors">
                    {product.label}
                  </h3>
                  <p className="text-xl mb-6 group-hover:text-gray-300 transition-colors max-w-md">
                    {product.description}
                  </p>
                  <Link
                    to={product.link}
                    className="inline-flex items-center px-8 py-3 bg-white text-gray-900 rounded-xl font-semibold hover:bg-gray-100 transition-all duration-300 transform group-hover:translate-x-2"
                  >
                    Shop Now
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
                        d="M14 5l7 7m0 0l-7 7m7-7H3"
                      />
                    </svg>
                  </Link>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="px-8 py-16 bg-white">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="text-center p-8 rounded-2xl bg-gray-50 hover:bg-gray-100 transition-all duration-300 border border-gray-200">
              <div className="inline-flex items-center justify-center w-16 h-16 bg-gray-800 rounded-full mb-6">
                <svg
                  className="w-8 h-8 text-white"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M3 10h18M7 15h1m4 0h1m-7 4l-3-3m3-3l3 3m-3-3h12M3 4h18M7 8h1m4 0h1m-7 4l-3-3m3-3l3 3m-3-3h12"
                  />
                </svg>
              </div>
              <h4 className="font-semibold text-lg mb-3 text-gray-800">
                FREE AND FAST DELIVERY
              </h4>
              <p className="text-gray-600">
                Free delivery for all orders over LKR 5000
              </p>
            </div>

            <div className="text-center p-8 rounded-2xl bg-gray-50 hover:bg-gray-100 transition-all duration-300 border border-gray-200">
              <div className="inline-flex items-center justify-center w-16 h-16 bg-gray-800 rounded-full mb-6">
                <svg
                  className="w-8 h-8 text-white"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M3 5a2 2 0 012-2h14a2 2 0 012 2v14a2 2 0 01-2 2H5a2 2 0 01-2-2V5z"
                  />
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M11 14l2-2m-2-2l2 2M3 15h18M15 11l2-2m-2-2l2 2"
                  />
                </svg>
              </div>
              <h4 className="font-semibold text-lg mb-3 text-gray-800">
                24/7 CUSTOMER SERVICE
              </h4>
              <p className="text-gray-600">Friendly 24/7 customer support</p>
            </div>

            <div className="text-center p-8 rounded-2xl bg-gray-50 hover:bg-gray-100 transition-all duration-300 border border-gray-200">
              <div className="inline-flex items-center justify-center w-16 h-16 bg-gray-800 rounded-full mb-6">
                <svg
                  className="w-8 h-8 text-white"
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
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M15 13a3 3 0 11-6 0 3 3 0 016 0z"
                  />
                </svg>
              </div>
              <h4 className="font-semibold text-lg mb-3 text-gray-800">
                MONEY BACK GUARANTEE
              </h4>
              <p className="text-gray-600">We return money within 30 days</p>
            </div>
          </div>
        </div>
      </div>

      <div className="bg-gray-950 text-white py-16 text-center">
        <h2 className="text-4xl font-bold mb-4">Big Summer Sale</h2>
        <p className="text-xl text-gray-300 mb-8 max-w-2xl mx-auto">
          Discover amazing deals on handcrafted products from our local artisan
        </p>
        <button className="bg-white text-gray-800 px-8 py-3 rounded-lg font-semibold hover:bg-gray-100 transition-colors duration-300">
          Shop Now
        </button>
      </div>

      <footer className="bg-black text-white px-10 py-10">
        <div className="max-w-6xl mx-auto grid grid-cols-3 gap-10 text-sm">
          <div>
            <p className="mb-2 font-bold">LOCALUP</p>
            <p>
              We are a residential interior design firm located in Portland. Our
              boutique-studio offers more than
            </p>
            <div className="flex gap-3 mt-4 text-lg">
              <i className="fab fa-twitter"></i>
              <i className="fab fa-facebook"></i>
              <i className="fab fa-tiktok"></i>
              <i className="fab fa-instagram"></i>
            </div>
          </div>

          <div>
            <p className="mb-2 font-bold">Services</p>
            <ul className="space-y-1">
              <li>Bonus program</li>
              <li>Gift cards</li>
              <li>Credit and payment</li>
              <li>Service contracts</li>
              <li>Non-cash account</li>
              <li>Payment</li>
            </ul>
          </div>

          <div>
            <p className="mb-2 font-bold">Assistance to the buyer</p>
            <ul className="space-y-1">
              <li>Find an order</li>
              <li>Terms of delivery</li>
              <li>Exchange and return of goods</li>
              <li>Guarantee</li>
              <li>FAQs</li>
              <li>Terms of use</li>
            </ul>
          </div>
        </div>
        <div className="max-w-7xl mx-auto px-8 mt-8 pt-8 border-t border-gray-800 text-center text-gray-400">
          <p>&copy; 2024 LocalUp. All rights reserved.</p>
        </div>
      </footer>
      <HelpCenter />
    </div>
  );
}

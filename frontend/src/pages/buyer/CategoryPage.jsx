import React, { useEffect, useState, useCallback } from "react";
import { useParams, Link } from "react-router-dom";
import axios from "axios";
import { useCart } from "../../context/CartContext";
import HelpCenter from "../../components/HelpCenter";
import { toast } from "react-toastify";

const CategoryPage = () => {
  const { categoryName } = useParams();
  const { addToCart } = useCart();
  const [products, setProducts] = useState([]);
  const [allProducts, setAllProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [sort, setSort] = useState("priceAsc");
  const [priceRange, setPriceRange] = useState([0, 1000]);
  const [showFilters, setShowFilters] = useState(false);
  const [inStockOnly, setInStockOnly] = useState(false);
  const [outOfStockOnly, setOutOfStockOnly] = useState(false);
  const [filtersApplied, setFiltersApplied] = useState(false);
  const [initialLoad, setInitialLoad] = useState(true);

  // Find max price for better range slider 
  const maxPriceAllProducts =
    allProducts.length > 0
      ? Math.max(...allProducts.map((p) => p.price), 1000)
      : 1000;

  // Find min price for better range slider 
  const minPriceAllProducts =
    allProducts.length > 0
      ? Math.min(...allProducts.map((p) => p.price), 0)
      : 0;

  const applySorting = useCallback((productsToSort, sortType) => {
    let sortedProducts = [...productsToSort];

    switch (sortType) {
      case "priceAsc":
        sortedProducts.sort((a, b) => a.price - b.price);
        break;
      case "priceDesc":
        sortedProducts.sort((a, b) => b.price - a.price);
        break;
      case "newest":
        sortedProducts.sort((a, b) => {
          if (a.createdAt && b.createdAt) {
            return new Date(b.createdAt) - new Date(a.createdAt);
          }
          return a.name.localeCompare(b.name);
        });
        break;
      case "rating":
        sortedProducts.sort((a, b) => {
          const ratingA = a.rating || 0;
          const ratingB = b.rating || 0;
          if (ratingB !== ratingA) {
            return ratingB - ratingA;
          }
          return a.name.localeCompare(b.name);
        });
        break;
      case "popular":
        sortedProducts.sort((a, b) => {
          const popularityA = a.popularity || 0;
          const popularityB = b.popularity || 0;
          if (popularityB !== popularityA) {
            return popularityB - popularityA;
          }
          return a.name.localeCompare(b.name);
        });
        break;
      default:
        sortedProducts.sort((a, b) => a.name.localeCompare(b.name));
        break;
    }

    setProducts(sortedProducts);
  }, []);

  const applyFilters = useCallback(
    (products) => {
      let filteredProducts = [...products];

      //  stock filters 
      if (inStockOnly && !outOfStockOnly) {
        filteredProducts = filteredProducts.filter(
          (product) => product.quantity > 0
        );
      } else if (!inStockOnly && outOfStockOnly) {
        filteredProducts = filteredProducts.filter(
          (product) => product.quantity === 0
        );
      }

      // price filter 
      filteredProducts = filteredProducts.filter(
        (product) =>
          product.price >= priceRange[0] && product.price <= priceRange[1]
      );

      //  sorting to the filtered results
      applySorting(filteredProducts, sort);
    },
    [inStockOnly, outOfStockOnly, priceRange, sort, applySorting]
  );

  useEffect(() => {
    const fetchCategoryProducts = async () => {
      try {
        const res = await axios.get(
          `http://localhost:5000/api/products?category=${encodeURIComponent(
            categoryName
          )}`
        );

        setAllProducts(res.data);

        // Update price range to match all products
        if (res.data.length > 0) {
          const minPrice = Math.min(...res.data.map((p) => p.price));
          const maxPrice = Math.max(...res.data.map((p) => p.price));
          setPriceRange([minPrice, maxPrice]);
        }

        applySorting(res.data, "priceAsc");
        setFiltersApplied(false);
        setInitialLoad(false);
      } catch (err) {
        console.error("Error fetching category products:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchCategoryProducts();
  }, [categoryName, applySorting]);

  useEffect(() => {
    if (initialLoad) return;

    const hasActiveFilters =
      priceRange[0] !== minPriceAllProducts ||
      priceRange[1] !== maxPriceAllProducts ||
      inStockOnly ||
      outOfStockOnly;

    setFiltersApplied(hasActiveFilters);

    if (hasActiveFilters) {
      applyFilters(allProducts);
    } else {
      applySorting(allProducts, sort);
    }
  }, [
    priceRange,
    inStockOnly,
    outOfStockOnly,
    sort,
    allProducts,
    applyFilters,
    applySorting,
    minPriceAllProducts,
    maxPriceAllProducts,
    initialLoad,
  ]);

  useEffect(() => {
    if (inStockOnly || outOfStockOnly) {
      let stockFilteredProducts = [...allProducts];

      if (inStockOnly && !outOfStockOnly) {
        stockFilteredProducts = stockFilteredProducts.filter(
          (product) => product.quantity > 0
        );
      } else if (!inStockOnly && outOfStockOnly) {
        stockFilteredProducts = stockFilteredProducts.filter(
          (product) => product.quantity === 0
        );
      }

      if (stockFilteredProducts.length > 0) {
        const minPrice = Math.min(...stockFilteredProducts.map((p) => p.price));
        const maxPrice = Math.max(...stockFilteredProducts.map((p) => p.price));

        if (minPrice !== priceRange[0] || maxPrice !== priceRange[1]) {
          setPriceRange([minPrice, maxPrice]);
        }
      }
    }
  }, [inStockOnly, outOfStockOnly, allProducts, priceRange]);

  const handleResetFilters = () => {
    setPriceRange([minPriceAllProducts, maxPriceAllProducts]);
    setInStockOnly(false);
    setOutOfStockOnly(false);
    setFiltersApplied(false);
  };

  const handleStockFilterChange = (filterType) => {
    if (filterType === "inStock") {
      setInStockOnly(!inStockOnly);
      setOutOfStockOnly(false); 
    } else if (filterType === "outOfStock") {
      setOutOfStockOnly(!outOfStockOnly);
      setInStockOnly(false); 
    }
  };

  const renderStockStatus = (quantity) => {
    if (quantity === 0) {
      return (
        <div className="mt-3 p-2 bg-red-50 rounded-lg border border-red-100">
          <span className="text-red-700 font-medium text-sm flex items-center">
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
                d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
              />
            </svg>
            Out of Stock
          </span>
        </div>
      );
    } else if (quantity <= 5) {
      return (
        <div className="mt-3 p-2 bg-amber-50 rounded-lg border border-amber-100">
          <div className="flex justify-between items-center mb-1">
            <span className="text-amber-700 font-medium text-sm flex items-center">
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
                  d="M13 10V3L4 14h7v7l9-11h-7z"
                />
              </svg>
              Low Stock
            </span>
            <span className="text-amber-700 text-xs font-semibold">
              Only {quantity} left
            </span>
          </div>
          <div className="w-full bg-amber-200 rounded-full h-1.5">
            <div
              className="bg-amber-500 h-1.5 rounded-full"
              style={{ width: `${(quantity / 5) * 100}%` }}
            ></div>
          </div>
        </div>
      );
    } else {
      return (
        <div className="mt-3 p-2 bg-green-50 rounded-lg border border-green-100">
          <span className="text-green-700 font-medium text-sm flex items-center">
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
                d="M5 13l4 4L19 7"
              />
            </svg>
            In Stock
          </span>
        </div>
      );
    }
  };

  const displayedProducts = filtersApplied ? products : allProducts;

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex items-center justify-between">
            <div>
              <nav className="text-sm text-gray-500 mb-2">
                <Link to="/home" className="hover:text-gray-700">
                  Home
                </Link>
                <span className="mx-2">/</span>
                <span className="text-gray-800 font-medium">
                  {categoryName}
                </span>
              </nav>
              <h1 className="text-3xl font-bold text-gray-900">
                {categoryName}
              </h1>
              <p className="text-gray-600 mt-1">
                {displayedProducts.length}{" "}
                {displayedProducts.length === 1 ? "product" : "products"}{" "}
                available
              </p>
            </div>

            <button
              onClick={() => setShowFilters(!showFilters)}
              className="md:hidden flex items-center px-4 py-2 bg-gray-800 text-white rounded-lg"
            >
              {showFilters ? "Hide Filters" : "Show Filters"}
              <svg
                className="w-4 h-4 ml-2"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M3 4a1 1 0 011-1h16a1 1 0 011 1v2.586a1 1 0 01-.293.707l-6.414 6.414a1 1 0 00-.293.707V17l-4 4v-6.586a1 1 0 00-.293-.707L3.293 7.293A1 1 0 013 6.586V4z"
                />
              </svg>
            </button>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex flex-col md:flex-row gap-8">
          <div
            className={`md:w-1/4 bg-white p-6 rounded-xl shadow-sm h-fit ${
              showFilters ? "block" : "hidden md:block"
            }`}
          >
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-lg font-semibold text-gray-900">Filters</h2>
              {filtersApplied && (
                <button
                  onClick={handleResetFilters}
                  className="text-sm text-gray-600 hover:text-gray-800"
                >
                  Clear All
                </button>
              )}
            </div>

            <div className="mb-6">
              <h3 className="text-sm font-medium text-gray-700 mb-3">
                Availability
              </h3>
              <div className="space-y-2">
                <label className="flex items-center">
                  <input
                    type="checkbox"
                    className="rounded text-gray-700 focus:ring-gray-500"
                    checked={inStockOnly}
                    onChange={() => handleStockFilterChange("inStock")}
                  />
                  <span className="ml-2 text-sm text-gray-600">In Stock</span>
                </label>
                <label className="flex items-center">
                  <input
                    type="checkbox"
                    className="rounded text-gray-700 focus:ring-gray-500"
                    checked={outOfStockOnly}
                    onChange={() => handleStockFilterChange("outOfStock")}
                  />
                  <span className="ml-2 text-sm text-gray-600">
                    Out of Stock
                  </span>
                </label>
              </div>
            </div>

            <div className="mb-6">
              <h3 className="text-sm font-medium text-gray-700 mb-3">
                Price Range
              </h3>
              <div className="space-y-4">
                <div className="flex justify-between text-sm text-gray-500">
                  <span>${priceRange[0]}</span>
                  <span>${priceRange[1]}</span>
                </div>
                <div className="relative pt-1">
                  <input
                    type="range"
                    min={minPriceAllProducts}
                    max={maxPriceAllProducts}
                    value={priceRange[0]}
                    onChange={(e) =>
                      setPriceRange([parseInt(e.target.value), priceRange[1]])
                    }
                    className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer"
                  />
                  <input
                    type="range"
                    min={minPriceAllProducts}
                    max={maxPriceAllProducts}
                    value={priceRange[1]}
                    onChange={(e) =>
                      setPriceRange([priceRange[0], parseInt(e.target.value)])
                    }
                    className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer mt-2"
                  />
                </div>
                <div className="flex space-x-2">
                  <div className="flex-1">
                    <label className="block text-xs text-gray-500 mb-1">
                      Min Price
                    </label>
                    <input
                      type="number"
                      min={minPriceAllProducts}
                      max={maxPriceAllProducts}
                      value={priceRange[0]}
                      onChange={(e) =>
                        setPriceRange([
                          parseInt(e.target.value) || minPriceAllProducts,
                          priceRange[1],
                        ])
                      }
                      className="w-full p-2 border border-gray-300 rounded text-sm"
                    />
                  </div>
                  <div className="flex-1">
                    <label className="block text-xs text-gray-500 mb-1">
                      Max Price
                    </label>
                    <input
                      type="number"
                      min={minPriceAllProducts}
                      max={maxPriceAllProducts}
                      value={priceRange[1]}
                      onChange={(e) =>
                        setPriceRange([
                          priceRange[0],
                          parseInt(e.target.value) || maxPriceAllProducts,
                        ])
                      }
                      className="w-full p-2 border border-gray-300 rounded text-sm"
                    />
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div className="md:w-3/4">
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6 bg-white p-4 rounded-xl shadow-sm">
              <div className="flex items-center mb-3 sm:mb-0">
                <span className="text-sm text-gray-700 font-medium mr-2">
                  Sort by:
                </span>
                <select
                  value={sort}
                  onChange={(e) => setSort(e.target.value)}
                  className="border border-gray-300 rounded-lg px-3 py-2 text-sm text-gray-700 bg-white focus:outline-none focus:ring-2 focus:ring-gray-500 focus:border-transparent"
                >
                  <option value="priceAsc">Price: Low to High</option>
                  <option value="priceDesc">Price: High to Low</option>
                  <option value="popular">Most Popular</option>
                  <option value="newest">Newest Arrivals</option>
                  <option value="rating">Highest Rated</option>
                </select>
              </div>

              {filtersApplied && (
                <div className="text-sm text-gray-600">
                  Showing {products.length} of {allProducts.length} products
                </div>
              )}
            </div>

            {loading ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                {[...Array(6)].map((_, i) => (
                  <div
                    key={i}
                    className="bg-white rounded-xl shadow-sm overflow-hidden animate-pulse"
                  >
                    <div className="h-48 bg-gray-200"></div>
                    <div className="p-4 space-y-3">
                      <div className="h-4 bg-gray-200 rounded"></div>
                      <div className="h-4 bg-gray-200 rounded w-2/3"></div>
                      <div className="h-6 bg-gray-200 rounded w-1/3"></div>
                    </div>
                  </div>
                ))}
              </div>
            ) : displayedProducts.length === 0 ? (
              <div className="bg-white rounded-xl shadow-sm p-8 text-center">
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
                    d="M9.172 16.172a4 4 0 015.656 0M9 极市10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                  />
                </svg>
                <h3 className="text-lg font-medium text-gray-900 mb-2">
                  No products found
                </h3>
                <p className="text-gray-500 mb-4">
                  {filtersApplied
                    ? "No products match your filters. Try adjusting your criteria."
                    : "Sorry, there are no products available in this category right now."}
                </p>
                {filtersApplied && (
                  <button
                    onClick={handleResetFilters}
                    className="inline-flex items-center px-4 py-2 bg-gray-800 text-white rounded-lg hover:bg-gray-900 transition-colors mr-2"
                  >
                    Reset Filters
                  </button>
                )}
                <Link
                  to="/home"
                  className="inline-flex items-center px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
                >
                  Continue Shopping
                </Link>
              </div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                {displayedProducts.map((product) => (
                  <div
                    key={product._id}
                    className="bg-white rounded-xl shadow-sm overflow-hidden transition-transform hover:transform hover:scale-105 hover:shadow-md flex flex-col"
                  >
                    <div className="relative">
                      <img
                        src={`http://localhost:5000/uploads/${product.image}`}
                        alt={product.name}
                        className="w-full h-48 object-cover"
                        onError={(e) => {
                          e.target.src =
                            "https://via.placeholder.com/300x200?text=Image+Not+Found";
                        }}
                      />
                    </div>

                    <div className="p-4 flex flex-col flex-grow">
                      <div className="flex justify-between items-start mb-2">
                        <h2 className="text-lg font-semibold text-gray-900 line-clamp-1">
                          {product.name}
                        </h2>
                        <span className="text-lg font-bold text-gray-900">
                          ${Number(product.price).toFixed(2)}
                        </span>
                      </div>

                      <p className="text-sm text-gray-600 mb-4 line-clamp-2">
                        {product.description}
                      </p>

                      {/* Rating and Reviews */}
                      <div className="flex items-center mb-4">
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
                          (1.4k reviews)
                        </span>
                      </div>

                      {renderStockStatus(product.quantity)}

                      <div className="flex space-x-2 mt-auto pt-4">
                        <Link
                          to={`/product/${product._id}`}
                          className="flex-1 py-2 bg-gray-800 text-white text-center rounded-lg text-sm font-medium hover:bg-gray-900 transition-colors"
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
      </div>
      <HelpCenter />
    </div>
  );
};

export default CategoryPage;

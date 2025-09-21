import React, { useState } from "react";
import { useCart } from "../../context/CartContext";
import { Link } from "react-router-dom";
import { toast } from "react-toastify";

const Cart = () => {
  const { items, updateQuantity, removeFromCart, getCartTotal, clearCart } =
    useCart();
  const [isProcessing, setIsProcessing] = useState(false);

  const handleQuantityChange = (productId, newQty, product) => {
    if (newQty < 1) {
      removeFromCart(productId);
      toast.info(`${product.name} removed from cart`);
      return;
    }
    updateQuantity(productId, newQty);
  };

  const handleRemove = (productId, productName) => {
    removeFromCart(productId);
    toast.info(`${productName} removed from cart`);
  };

  const handleClearCart = () => {
    clearCart();
    toast.info("Cart cleared");
  };

  const handleCheckout = () => {
    setIsProcessing(true);
    setTimeout(() => {
      setIsProcessing(false);
      toast.success("Order placed successfully!");
    }, 2000);
  };

  // Calculate subtotal, shipping, and total
  const subtotal = getCartTotal();
  const shipping = subtotal > 0 ? (subtotal > 5000 ? 0 : 500) : 0;
  const total = subtotal + shipping;

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="bg-white border-b border-gray-200 py-6">
        <div className="max-w-6xl mx-auto px-4">
          <nav className="flex text-sm text-gray-500 mb-4">
            <Link to="/home" className="hover:text-gray-700 transition-colors">
              Home
            </Link>
            <span className="mx-2">/</span>
            <span className="text-gray-800 font-medium">Shopping Cart</span>
          </nav>

          <h1 className="text-3xl font-bold text-gray-800 mb-2">
            Shopping Cart
          </h1>

          <p className="text-gray-600">
            {items.length} {items.length === 1 ? "product" : "products"}{" "}
            available
          </p>
        </div>
      </div>

      <div className="py-8 px-4">
        <div className="max-w-6xl mx-auto">
          {items.length === 0 ? (
            <div className="bg-white rounded-lg shadow-md p-10 text-center">
              <div className="mx-auto w-24 h-24 bg-gray-100 rounded-full flex items-center justify-center mb-6">
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
                    strokeWidth={2}
                    d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17a2 2 0 0 0 2-2V5a2 2 0 0 0-2-2H5a2 2 0 0 0-2 2v12a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2v-4"
                  />
                </svg>
              </div>
              <h2 className="text-2xl font-semibold text-gray-700 mb-4">
                Your cart is empty
              </h2>
              <p className="text-gray-500 mb-8">
                Looks like you haven't added any items to your cart yet.
              </p>
              <Link
                to="/home"
                className="inline-flex items-center px-6 py-3 bg-gray-800 text-white rounded-lg hover:bg-black transition-all duration-300 shadow-md hover:shadow-lg"
              >
                Start Shopping
                <svg
                  className="w-5 h-5 ml-2"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M17 8l4 4m0 0l-4 4m4-4H3"
                  />
                </svg>
              </Link>
            </div>
          ) : (
            <div className="flex flex-col lg:flex-row gap-8">
              <div className="lg:w-2/3">
                <div className="bg-white rounded-lg shadow-md overflow-hidden">
                  <div className="p-6 border-b border-gray-100">
                    <h2 className="text-xl font-semibold text-gray-800">
                      Cart Items ({items.length})
                    </h2>
                  </div>

                  <div className="divide-y divide-gray-100">
                    {items.map(({ product, quantity }, index) => (
                      <div
                        key={product?._id || index}
                        className="p-6 flex flex-col sm:flex-row items-start gap-4 hover:bg-gray-50 transition-colors"
                      >
                        <div className="flex-shrink-0">
                          <img
                            src={
                              product?.image
                                ? `http://localhost:5000/uploads/${product.image}`
                                : "https://via.placeholder.com/120x120?text=No+Image"
                            }
                            alt={product?.name || "Product"}
                            className="w-20 h-20 sm:w-24 sm:h-24 object-cover rounded-lg shadow-md"
                          />
                        </div>

                        <div className="flex-grow">
                          <h3 className="text-lg font-medium text-gray-800 mb-1">
                            {product?.name || "Unnamed Product"}
                          </h3>
                          <p className="text-gray-500 text-sm mb-3 line-clamp-2">
                            {product?.description || "No description available"}
                          </p>
                          <p className="text-lg font-semibold text-gray-800 mb-4">
                            LKR{" "}
                            {product?.price
                              ? Number(product.price).toFixed(2)
                              : "0.00"}
                          </p>

                          <div className="flex items-center justify-between">
                            <div className="flex items-center">
                              <span className="text-gray-600 mr-3">Qty:</span>
                              <div className="flex items-center border border-gray-200 rounded-lg">
                                <button
                                  onClick={() =>
                                    handleQuantityChange(
                                      product?._id,
                                      quantity - 1,
                                      product
                                    )
                                  }
                                  className="px-3 py-1 text-gray-500 hover:text-gray-700 hover:bg-gray-100 transition-colors"
                                >
                                  −
                                </button>
                                <span className="px-3 py-1 text-gray-800 font-medium">
                                  {quantity}
                                </span>
                                <button
                                  onClick={() =>
                                    handleQuantityChange(
                                      product?._id,
                                      quantity + 1,
                                      product
                                    )
                                  }
                                  className="px-3 py-1 text-gray-500 hover:text-gray-700 hover:bg-gray-100 transition-colors"
                                >
                                  +
                                </button>
                              </div>
                            </div>

                            <button
                              onClick={() =>
                                handleRemove(product?._id, product?.name)
                              }
                              className="flex items-center text-red-500 hover:text-red-700 transition-colors"
                            >
                              <svg
                                className="w-5 h-5 mr-1"
                                fill="none"
                                stroke="currentColor"
                                viewBox="0 0 24 24"
                                xmlns="http://www.w3.org/2000/svg"
                              >
                                <path
                                  strokeLinecap="round"
                                  strokeLinejoin="round"
                                  strokeWidth={2}
                                  d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
                                />
                              </svg>
                              Remove
                            </button>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>

                  <div className="p-6 border-t border-gray-100 flex justify-between items-center">
                    <button
                      onClick={handleClearCart}
                      className="flex items-center text-gray-500 hover:text-red-500 transition-colors"
                    >
                      <svg
                        className="w-5 h-5 mr-1"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                        xmlns="http://www.w3.org/2000/svg"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
                        />
                      </svg>
                      Clear Cart
                    </button>

                    <div className="text-lg font-semibold text-gray-800">
                      Subtotal: LKR {subtotal.toFixed(2)}
                    </div>
                  </div>
                </div>
              </div>

              <div className="lg:w-1/3">
                <div className="flex flex-col gap-6">
                  <div className="bg-white rounded-lg shadow-md overflow-hidden">
                    <div className="bg-gradient-to-r from-blue-50 to-indigo-50 p-4 border-b border-gray-100">
                      <h3 className="font-semibold text-gray-800 mb-1">
                        Free Shipping Offer
                      </h3>
                      <p className="text-sm text-gray-600 mb-2">
                        Get free shipping on orders over LKR 5,000
                      </p>
                      <div className="w-full bg-gray-200 rounded-full h-2 mb-1">
                        <div
                          className="bg-blue-500 h-2 rounded-full transition-all duration-300"
                          style={{
                            width: `${Math.min((subtotal / 5000) * 100, 100)}%`,
                          }}
                        ></div>
                      </div>
                      <p className="text-xs text-gray-500">
                        {subtotal >= 5000
                          ? "🎉 You've qualified for free shipping!"
                          : `Add LKR ${(5000 - subtotal).toFixed(
                              2
                            )} more for free shipping`}
                      </p>
                    </div>

                    <div className="p-6">
                      <h2 className="text-xl font-semibold text-gray-800 mb-6">
                        Order Summary
                      </h2>
                      <div className="space-y-4 mb-6">
                        <div className="flex justify-between">
                          <span className="text-gray-600">Subtotal</span>
                          <span className="text-gray-800">
                            LKR {subtotal.toFixed(2)}
                          </span>
                        </div>

                        <div className="flex justify-between">
                          <span className="text-gray-600">Shipping</span>
                          <span className="text-gray-800">
                            {shipping === 0
                              ? "FREE"
                              : `LKR ${shipping.toFixed(2)}`}
                          </span>
                        </div>

                        <div className="border-t border-gray-200 pt-4 flex justify-between text-lg font-semibold">
                          <span className="text-gray-800">Total</span>
                          <span className="text-gray-800">
                            LKR {total.toFixed(2)}
                          </span>
                        </div>
                      </div>
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
                      <div className="mt-6 text-center text-sm text-gray-500">
                        <p>
                          Your personal data will be used to process your order,
                          support your experience throughout this website, and
                          for other purposes described in our privacy policy.
                        </p>
                      </div>
                      <div className="mt-6 flex items-center justify-center space-x-4">
                        <div className="flex items-center text-gray-500">
                          <svg
                            className="w-5 h-5 mr-1 text-green-500"
                            fill="none"
                            stroke="currentColor"
                            viewBox="0 0 24 24"
                            xmlns="http://www.w3.org/2000/svg"
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth={2}
                              d="M5 13l4 4L19 7"
                            />
                          </svg>
                          Secure checkout
                        </div>
                        <div className="flex items-center text-gray-500">
                          <svg
                            className="w-5 h-5 mr-1 text-green-500"
                            fill="none"
                            stroke="currentColor"
                            viewBox="0 0 24 24"
                            xmlns="http://www.w3.org/2000/svg"
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth={2}
                              d="M5 13l4 4L19 7"
                            />
                          </svg>
                          Buyer protection
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Cart;

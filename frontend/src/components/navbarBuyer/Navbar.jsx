import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useCart } from "../../context/CartContext";
import logo from "../../assets/logo.png";
import { toast } from "react-toastify";

function Navbar() {
  const { getCartItemsCount } = useCart();
  const navigate = useNavigate();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("role");
    toast.success("You have been logged out.");
    navigate("/");
    setIsModalOpen(false);
  };

  const openModal = () => setIsModalOpen(true);
  const closeModal = () => setIsModalOpen(false);
  const toggleMobileMenu = () => setIsMobileMenuOpen(!isMobileMenuOpen);

  return (
    <>
      <nav className="bg-white shadow-md sticky top-0 z-50 border-b border-gray-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <Link to="/" className="flex-shrink-0 flex items-center group">
              <img
                src={logo}
                alt="Logo"
                className="h-10 md:h-12 object-cover rounded-xl transition-all duration-300 group-hover:scale-110 "
              />
            </Link>

            <div className="hidden md:flex md:items-center md:space-x-1">
              <Link
                to="/home"
                className="px-4 py-2 rounded-lg text-base font-medium text-gray-700 transition-all duration-300 hover:text-black hover:bg-gray-100 hover:shadow-sm border border-transparent hover:border-gray-200"
              >
                Home
              </Link>
              <Link
                to="/about"
                className="px-4 py-2 rounded-lg text-base font-medium text-gray-700 transition-all duration-300 hover:text-black hover:bg-gray-100 hover:shadow-sm border border-transparent hover:border-gray-200"
              >
                About
              </Link>
              <Link
                to="/contact"
                className="px-4 py-2 rounded-lg text-base font-medium text-gray-700 transition-all duration-300 hover:text-black hover:bg-gray-100 hover:shadow-sm border border-transparent hover:border-gray-200"
              >
                Contact
              </Link>
              <Link
                to="/orderbuyer"
                className="px-4 py-2 rounded-lg text-base font-medium text-gray-700 transition-all duration-300 hover:text-black hover:bg-gray-100 hover:shadow-sm border border-transparent hover:border-gray-200"
              >
                View Orders
              </Link>
              <Link
                to="/chatbot"
                className="px-4 py-2 rounded-lg text-base font-medium text-gray-700 transition-all duration-300 hover:text-black hover:bg-gray-100 hover:shadow-sm border border-transparent hover:border-gray-200"
              >
                Chatbot
              </Link>
              <Link
                to="/community"
                className="px-4 py-2 rounded-lg text-base font-medium text-gray-700 transition-all duration-300 hover:text-black hover:bg-gray-100 hover:shadow-sm border border-transparent hover:border-gray-200"
              >
                Community
              </Link>
            </div>

            <div className="flex items-center space-x-4">
              <Link
                to="/cart"
                className="relative p-2 rounded-lg transition-all duration-300 group hover:bg-gray-100 hover:shadow-sm border border-transparent hover:border-gray-200"
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-6 w-6 text-gray-700 transition-all duration-300 group-hover:scale-110 group-hover:text-black"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z"
                  />
                </svg>
                {getCartItemsCount() > 0 && (
                  <span className="absolute -top-1 -right-1 bg-black text-white text-xs rounded-full h-5 w-5 flex items-center justify-center transform transition-all duration-300 group-hover:scale-110 group-hover:bg-red-500">
                    {getCartItemsCount()}
                  </span>
                )}
              </Link>

              <Link
                to="/profile"
                className="p-2 rounded-lg transition-all duration-300 group hover:bg-gray-100 hover:shadow-sm border border-transparent hover:border-gray-200"
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-6 w-6 text-gray-700 transition-all duration-300 group-hover:scale-110 group-hover:text-black"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
                  />
                </svg>
              </Link>

              <button
                onClick={openModal}
                className="ml-2 px-4 py-2 rounded-lg text-base font-medium text-white bg-gray-800 transition-all duration-300 hover:bg-black hover:shadow-md transform hover:-translate-y-0.5 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-800"
              >
                Logout
              </button>

              <button
                onClick={toggleMobileMenu}
                className="md:hidden inline-flex items-center justify-center p-2 rounded-md text-gray-700 transition-all duration-300 hover:text-black hover:bg-gray-100 hover:shadow-sm focus:outline-none focus:ring-2 focus:ring-inset focus:ring-gray-800"
              >
                <svg
                  className="h-6 w-6"
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M4 6h16M4 12h16M4 18h16"
                  />
                </svg>
              </button>
            </div>
          </div>
        </div>

        {isMobileMenuOpen && (
          <div className="md:hidden bg-white border-t border-gray-200">
            <div className="px-2 pt-2 pb-3 space-y-1 sm:px-3">
              <Link
                to="/home"
                className="block px-3 py-2 rounded-md text-base font-medium text-gray-700 hover:text-black hover:bg-gray-50"
                onClick={toggleMobileMenu}
              >
                Home
              </Link>
              <Link
                to="/about"
                className="block px-3 py-2 rounded-md text-base font-medium text-gray-700 hover:text-black hover:bg-gray-50"
                onClick={toggleMobileMenu}
              >
                About
              </Link>
              <Link
                to="/contact"
                className="block px-3 py-2 rounded-md text-base font-medium text-gray-700 hover:text-black hover:bg-gray-50"
                onClick={toggleMobileMenu}
              >
                Contact
              </Link>
              <Link
                to="/blog"
                className="block px-3 py-2 rounded-md text-base font-medium text-gray-700 hover:text-black hover:bg-gray-50"
                onClick={toggleMobileMenu}
              >
                Blog
              </Link>
              <Link
                to="/chatbot"
                className="block px-3 py-2 rounded-md text-base font-medium text-gray-700 hover:text-black hover:bg-gray-50"
                onClick={toggleMobileMenu}
              >
                Chatbot
              </Link>
              <Link
                to="/orderBuyer"
                className="block px-3 py-2 rounded-md text-base font-medium text-gray-700 hover:text-black hover:bg-gray-50"
                onClick={toggleMobileMenu}
              >
                View Orders
              </Link>
            </div>
          </div>
        )}
      </nav>

      {isModalOpen && (
        <div className="fixed inset-0 z-50 overflow-y-auto">
          <div className="flex items-center justify-center min-h-screen pt-4 px-4 pb-20 text-center sm:block sm:p-0">
            <div
              className="fixed inset-0 bg-gray-500 bg-opacity-75 transition-opacity"
              onClick={closeModal}
            ></div>

            <div className="inline-block align-bottom bg-white rounded-lg text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-lg sm:w-full">
              <div className="bg-white px-4 pt-5 pb-4 sm:p-6 sm:pb-4">
                <div className="sm:flex sm:items-start">
                  <div className="mx-auto flex-shrink-0 flex items-center justify-center h-12 w-12 rounded-full bg-red-100 sm:mx-0 sm:h-10 sm:w-10">
                    <svg
                      className="h-6 w-6 text-red-600"
                      xmlns="http://www.w3.org/2000/svg"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"
                      />
                    </svg>
                  </div>
                  <div className="mt-3 text-center sm:mt-0 sm:ml-4 sm:text-left">
                    <h3 className="text-lg leading-6 font-medium text-gray-900">
                      Confirm Logout
                    </h3>
                    <div className="mt-2">
                      <p className="text-sm text-gray-500">
                        Are you sure you want to logout? You'll need to login
                        again to access your account.
                      </p>
                    </div>
                  </div>
                </div>
              </div>
              <div className="bg-gray-50 px-4 py-3 sm:px-6 sm:flex sm:flex-row-reverse">
                <button
                  type="button"
                  onClick={handleLogout}
                  className="w-full inline-flex justify-center rounded-md border border-transparent shadow-sm px-4 py-2 bg-red-600 text-base font-medium text-white transition-all duration-300 hover:bg-red-700 hover:shadow-md transform hover:-translate-y-0.5 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500 sm:ml-3 sm:w-auto sm:text-sm"
                >
                  Logout
                </button>
                <button
                  type="button"
                  onClick={closeModal}
                  className="mt-3 w-full inline-flex justify-center rounded-md border border-gray-300 shadow-sm px-4 py-2 bg-white text-base font-medium text-gray-700 transition-all duration-300 hover:bg-gray-50 hover:shadow-md transform hover:-translate-y-0.5 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-500 sm:mt-0 sm:ml-3 sm:w-auto sm:text-sm"
                >
                  Cancel
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
}

export default Navbar;

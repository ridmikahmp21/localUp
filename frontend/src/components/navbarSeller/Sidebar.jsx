import {
  FaBox,
  FaChartBar,
  FaList,
  FaSignOutAlt,
  FaBlog,
  FaFileInvoice,
  FaChevronRight,
  FaTimes,
  FaBars,
} from "react-icons/fa";
import { Link, useLocation, useNavigate } from "react-router-dom";
import logo from "../../assets/logo.png";
import { useState } from "react";
import { toast } from "react-toastify";

export default function Sidebar() {
  const location = useLocation();
  const navigate = useNavigate();
  const [isExpanded, setIsExpanded] = useState(true);
  const [isMobileOpen, setIsMobileOpen] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const menuItems = [
    { name: "Dashboard", icon: <FaChartBar />, path: "/dashboard" },
    { name: "Products", icon: <FaBox />, path: "/products" },
    { name: "Orders", icon: <FaList />, path: "/orders" },
    { name: "Payments", icon: <FaFileInvoice />, path: "/payments" },
    { name: "Community", icon: <FaBlog />, path: "/blog" },
    {
      name: "Logout",
      icon: <FaSignOutAlt />,
      action: () => setIsModalOpen(true),
    },
  ];

  const toggleSidebar = () => {
    setIsExpanded(!isExpanded);
  };

  const closeMobileSidebar = () => {
    setIsMobileOpen(false);
  };

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("role");
    toast.success("You have been logged out.");
    navigate("/");
    setIsModalOpen(false);
    setIsMobileOpen(false);
  };

  const closeModal = () => {
    setIsModalOpen(false);
  };

  return (
    <>
      {/* Mobile menu button */}
      <button
        className="lg:hidden fixed top-4 left-4 z-50 p-2 rounded-md bg-gray-800 text-white shadow-lg"
        onClick={() => setIsMobileOpen(true)}
      >
        <FaBars className="text-lg" />
      </button>

      {/* Overlay for mobile */}
      {isMobileOpen && (
        <div
          className="fixed inset-0 bg-black bg-opacity-50 z-40 lg:hidden"
          onClick={closeMobileSidebar}
        ></div>
      )}

      {/* Sidebar */}
      <div
        className={`
          fixed top-0 left-0 h-screen bg-gray-900 
          text-white transition-all duration-300 z-50
          ${isExpanded ? "w-60" : "w-16"}
          ${
            isMobileOpen
              ? "translate-x-0"
              : "-translate-x-full lg:translate-x-0"
          }
        `}
        style={{ boxShadow: "none" }}
      >
        <div className="flex items-center justify-between p-3 border-b border-gray-700 bg-white">
          {isExpanded && (
            <Link to="/" className="block">
              <img src={logo} alt="Logo" className="h-9 object-contain" />
            </Link>
          )}

          <button
            onClick={toggleSidebar}
            className="p-1.5 rounded hover:bg-gray-200 transition-colors hidden lg:block"
          >
            {isExpanded ? (
              <FaChevronRight size={16} className="text-gray-800" />
            ) : (
              <FaChevronRight size={16} className="rotate-180 text-gray-800" />
            )}
          </button>

          <button
            onClick={closeMobileSidebar}
            className="p-1.5 rounded hover:bg-gray-200 transition-colors lg:hidden"
          >
            <FaTimes size={16} className="text-gray-800" />
          </button>
        </div>

        <nav className="flex flex-col mt-5 p-2 space-y-2">
          {menuItems.map((item) => {
            const isActive = item.path && location.pathname === item.path;

            return item.action ? (
              <button
                key={item.name}
                onClick={item.action}
                className={`
                  flex items-center gap-4 p-3 rounded-md transition-all duration-200
                  hover:bg-gray-800 hover:text-white text-gray-300
                `}
              >
                <span className="text-lg flex-shrink-0">{item.icon}</span>
                {isExpanded && (
                  <span className="text-base overflow-hidden transition-all">
                    {item.name}
                  </span>
                )}
              </button>
            ) : (
              <Link
                key={item.name}
                to={item.path}
                className={`
                  flex items-center gap-4 p-3 rounded-md transition-all duration-200
                  ${
                    isActive
                      ? "bg-gray-800 text-white font-medium"
                      : "hover:bg-gray-800 hover:text-white text-gray-300"
                  }
                `}
                onClick={closeMobileSidebar}
              >
                <span className="text-lg flex-shrink-0">{item.icon}</span>
                {isExpanded && (
                  <span className="text-base overflow-hidden transition-all">
                    {item.name}
                  </span>
                )}
                {isActive && isExpanded && (
                  <div className="ml-auto w-2 h-2 bg-white rounded-full"></div>
                )}
              </Link>
            );
          })}
        </nav>
      </div>

      {/* Logout Confirmation Modal */}
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

      {/* Minimal padding for main content */}
      <div className={isExpanded ? "lg:pl-60" : "lg:pl-16"}></div>
    </>
  );
}

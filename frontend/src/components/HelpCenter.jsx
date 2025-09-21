import React, { useState } from "react";
import help from "../assets/help-center.png";

const HelpCenter = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [activeTab, setActiveTab] = useState("home");

  const getCurrentTime = () => {
    return new Date().toLocaleTimeString([], {
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  const getGreeting = () => {
    const hour = new Date().getHours();
    if (hour < 12) return "Good morning";
    if (hour < 17) return "Good afternoon";
    return "Good evening";
  };

  return (
    <>
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="fixed bottom-6 right-6 w-16 h-16 bg-gray-800 rounded-full shadow-xl flex items-center justify-center text-white text-xl hover:bg-gray-900 transition-all duration-300 z-50"
        aria-label="Help and Support"
      >
        <img src={help} alt="Help Icon" className="w-10 h-10 rounded-full" />
      </button>

      {isOpen && (
        <div
          className="fixed inset-0 bg-black bg-opacity-30 backdrop-blur-sm z-30"
          onClick={() => setIsOpen(false)}
        ></div>
      )}

      {isOpen && (
        <div className="fixed bottom-32 right-6 w-[420px] h-[600px] bg-white rounded-2xl shadow-2xl border border-gray-300 z-50 flex flex-col overflow-hidden">
          <div className="bg-gradient-to-b from-gray-900 via-gray-700 to-white p-6 text-white">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-xl font-semibold">Help & Support</h2>
              <button
                onClick={() => setIsOpen(false)}
                className="text-white hover:text-gray-300 transition-colors"
                aria-label="Close help window"
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-6 w-6"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M6 18L18 6M6 6l12 12"
                  />
                </svg>
              </button>
            </div>

            {activeTab === "home" && (
              <div className="space-y-4 text-center">
                <h3 className="text-2xl font-medium">
                  {getGreeting()}, <span className="font-bold">Pebhashi</span>!
                </h3>
                <p className="text-4xl font-light tracking-wide">
                  {getCurrentTime()}
                </p>
                <p className="text-gray-200 text-base pt-2">
                  How can we help you today?
                </p>
              </div>
            )}
          </div>

          <div className="flex-1 overflow-y-auto p-6 bg-white">
            {activeTab === "home" && (
              <div className="space-y-6 pt-4">
                <div className="bg-gray-50 p-5 rounded-xl border border-gray-200">
                  <h4 className="text-lg font-medium text-gray-800 mb-4">
                    Quick Actions
                  </h4>
                  <div className="grid grid-cols-2 gap-3">
                    <button className="text-sm p-3 bg-white hover:bg-gray-100 rounded-lg transition-colors border border-gray-200 shadow-sm">
                      Browse Products
                    </button>
                    <button className="text-sm p-3 bg-white hover:bg-gray-100 rounded-lg transition-colors border border-gray-200 shadow-sm">
                      Track Order
                    </button>
                    <button className="text-sm p-3 bg-white hover:bg-gray-100 rounded-lg transition-colors border border-gray-200 shadow-sm">
                      Contact Support
                    </button>
                    <button className="text-sm p-3 bg-white hover:bg-gray-100 rounded-lg transition-colors border border-gray-200 shadow-sm">
                      Account Settings
                    </button>
                  </div>
                </div>
              </div>
            )}

            {activeTab === "message" && (
              <div className="space-y-6">
                <h3 className="text-xl font-medium text-gray-800">
                  Contact Support
                </h3>
                <p className="text-base text-gray-600">
                  Get in touch with our support team directly through WhatsApp.
                  We're here to help you with any questions.
                </p>
                <a
                  href="https://wa.me/1234567890"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="block w-full bg-gray-800 hover:bg-gray-900 text-white py-4 px-5 rounded-xl text-center font-medium transition-colors duration-300 text-base"
                >
                  <span className="inline-flex items-center justify-center">
                    <svg
                      className="w-5 h-5 mr-2"
                      fill="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893A11.821 11.821 0 0020.465 3.488" />
                    </svg>
                    Message via WhatsApp
                  </span>
                </a>
                <div className="bg-gray-50 p-4 rounded-xl border border-gray-200">
                  <h4 className="text-lg font-medium text-gray-700 mb-3">
                    Support Hours
                  </h4>
                  <div className="text-base text-gray-600 space-y-2">
                    <p>
                      <span className="font-medium">Monday-Friday:</span> 9:00
                      AM - 6:00 PM
                    </p>
                    <p>
                      <span className="font-medium">Saturday:</span> 10:00 AM -
                      4:00 PM
                    </p>
                    <p>
                      <span className="font-medium">Sunday:</span> Closed
                    </p>
                  </div>
                </div>
              </div>
            )}

            {activeTab === "help" && (
              <div className="space-y-6 overflow-y-auto">
                <h3 className="text-xl font-medium text-gray-800">
                  Support Center
                </h3>

                <div className="bg-gray-50 p-4 rounded-xl border border-gray-200">
                  <h4 className="text-lg font-semibold text-gray-800 flex items-center mb-3">
                    Services
                  </h4>
                  <p className="text-base text-gray-600">
                    At LocalUp, we aim to connect local sellers with buyers in
                    the most convenient and reliable way possible. Our platform
                    showcases a wide variety of locally available products,
                    giving buyers the chance to explore, compare, and purchase
                    items from trusted sellers in their community.
                  </p>
                </div>

                <div className="bg-gray-50 p-4 rounded-xl border border-gray-200">
                  <h4 className="text-lg font-semibold text-gray-800 flex items-center mb-3">
                    Payment
                  </h4>
                  <p className="text-base text-gray-600">
                    LocalUp provides secure and flexible payment options to make
                    your shopping stress-free. Buyers can choose to pay online
                    using Stripe, supporting debit and credit cards such as Visa
                    and MasterCard. For those who prefer a more traditional
                    method, Cash on Delivery (COD) is available.
                  </p>
                </div>

                <div className="bg-gray-50 p-4 rounded-xl border border-gray-200">
                  <h4 className="text-lg font-semibold text-gray-800 flex items-center mb-3">
                    Terms & Conditions
                  </h4>
                  <p className="text-base text-gray-600">
                    By using LocalUp, you agree to our terms and conditions,
                    which are designed to ensure a safe and fair environment for
                    both sellers and buyers. Users must provide accurate
                    information when creating accounts or placing orders.
                  </p>
                </div>
              </div>
            )}
          </div>

          <div className="border-t border-gray-200 bg-gray-50 py-3">
            <div className="flex justify-around">
              <button
                className={`flex flex-col items-center py-2 px-5 text-sm ${
                  activeTab === "home"
                    ? "text-gray-900"
                    : "text-gray-500 hover:text-gray-700"
                } transition-colors`}
                onClick={() => setActiveTab("home")}
              >
                <svg
                  className="w-6 h-6 mb-1"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6"
                  ></path>
                </svg>
                Home
              </button>
              <button
                className={`flex flex-col items-center py-2 px-5 text-sm ${
                  activeTab === "message"
                    ? "text-gray-900"
                    : "text-gray-500 hover:text-gray-700"
                } transition-colors`}
                onClick={() => setActiveTab("message")}
              >
                <svg
                  className="w-6 h-6 mb-1"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z"
                  ></path>
                </svg>
                Messages
              </button>
              <button
                className={`flex flex-col items-center py-2 px-5 text-sm ${
                  activeTab === "help"
                    ? "text-gray-900"
                    : "text-gray-500 hover:text-gray-700"
                } transition-colors`}
                onClick={() => setActiveTab("help")}
              >
                <svg
                  className="w-6 h-6 mb-1"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M8.228 9c.549-1.165 2.03-2 3.772-2 2.21 0 4 1.343 4 3 0 1.4-1.278 2.575-3.006 2.907-.542.104-.994.54-.994 1.093m0 3h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                  ></path>
                </svg>
                Help
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default HelpCenter;

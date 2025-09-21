import React, { useState } from "react";
import { useNavigate } from "react-router-dom"; 
import topBanner from "../../assets/top-banner.jpeg";
import bottomBanner from "../../assets/bottom-banner.jpeg";
import cat6 from "../../assets/cat-6.jpg";

const HeroPage = () => {
  const [activeTab, setActiveTab] = useState("buyer");
  const navigate = useNavigate(); 

  const handleBuyerClick = () => {
    setActiveTab("buyer");
    navigate("/signIn");
  };

  const handleSellerClick = () => {
    setActiveTab("seller");
    navigate("/signInSeller");
  };

  return (
    <div className="min-h-screen flex flex-col lg:flex-row font-sans bg-gray-50">
      <div className="lg:hidden py-6 px-6 text-center bg-gray-900 text-white">
        <h1 className="text-3xl font-bold">LOCALUP</h1>
        <p className="text-gray-300 mt-2">Direct Marketplace Connecting You to Local Artisans</p>
      </div>

      <div className="lg:w-2/5 flex flex-col items-center justify-center p-10 bg-gray-900 text-white">
        <div className="text-center mb-10">
          <h1 className="text-5xl font-bold mb-4">LOCALUP</h1>
          <p className="text-xl text-gray-300 mb-8">Direct Marketplace Connecting You to Local Artisans</p>
          
          <div className="flex justify-center space-x-4 mb-10">
            <div className="bg-gray-800 p-4 rounded-lg text-center w-40">
              <div className="text-2xl font-bold">1</div>
              <div className="text-sm text-gray-400">Premium Seller</div>
            </div>
            <div className="bg-gray-800 p-4 rounded-lg text-center w-40">
              <div className="text-2xl font-bold">50+</div>
              <div className="text-sm text-gray-400">Unique Products</div>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-2 gap-4 mb-10">
          <img
            src={topBanner}
            alt="Artisan Product 1"
            className="w-full h-40 object-cover rounded-lg"
          />
          <img
            src={cat6}
            alt="Artisan Product 2"
            className="w-full h-40 object-cover rounded-lg"
          />
          <img
            src={bottomBanner}
            alt="Artisan Product 3"
            className="w-full h-40 object-cover rounded-lg"
          />
          <div className="bg-gray-800 h-40 rounded-lg flex items-center justify-center p-4">
            <span className="text-gray-300 text-center">Handcrafted with care by local artisans</span>
          </div>
        </div>
      </div>

      <div className="lg:w-3/5 flex items-center justify-center p-10">
        <div className="w-full max-w-md">
          <div className="text-center mb-10">
            <h2 className="text-3xl font-bold text-gray-900 mb-2">Welcome to LocalUp</h2>
            <p className="text-gray-600">Discover exclusive handmade products from our local artisan</p>
          </div>

          <div className="bg-white rounded-2xl shadow-xl p-8 border border-gray-200">
            <div className="flex mb-8 bg-gray-100 rounded-xl p-1">
              <button
                className={`flex-1 py-4 rounded-xl transition-all duration-300 ${
                  activeTab === "buyer"
                    ? "bg-gray-900 text-white shadow-md font-semibold"
                    : "text-gray-600 hover:text-gray-800"
                }`}
                onClick={handleBuyerClick}
              >
                <div className="flex flex-col items-center">
                  <span className="font-medium">I'm a Buyer</span>
                  <span className="text-xs mt-1">Browse unique products</span>
                </div>
              </button>
              <button
                className={`flex-1 py-4 rounded-xl transition-all duration-300 ${
                  activeTab === "seller"
                    ? "bg-gray-900 text-white shadow-md font-semibold"
                    : "text-gray-600 hover:text-gray-800"
                }`}
                onClick={handleSellerClick}
              >
                <div className="flex flex-col items-center">
                  <span className="font-medium">I'm the Seller</span>
                  <span className="text-xs mt-1">Manage my products</span>
                </div>
              </button>
            </div>

            <div className="space-y-4 mb-8">
              <div className="flex items-center">
                <div className="bg-gray-100 p-2 rounded-lg mr-3">
                  <svg className="w-5 h-5 text-gray-700" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v13m0-13V6a2 2 0 112 2h-2zm0 0V5.5A2.5 2.5 0 109.5 8H12zm-7 4h14M5 12a2 2 0 110-4h14a2 2 0 110 4M5 12v7a2 2 0 002 2h10a2 2 0 002-2v-7" />
                  </svg>
                </div>
                <span className="text-gray-700">Direct access to handcrafted products</span>
              </div>
              
              <div className="flex items-center">
                <div className="bg-gray-100 p-2 rounded-lg mr-3">
                  <svg className="w-5 h-5 text-gray-700" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                  </svg>
                </div>
                <span className="text-gray-700">Secure and personalized shopping experience</span>
              </div>
              
              <div className="flex items-center">
                <div className="bg-gray-100 p-2 rounded-lg mr-3">
                  <svg className="w-5 h-5 text-gray-700" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8h2a2 2 0 012 2v6a2 2 0 01-2 2h-2v4l-4-4H9a1.994 1.994 0 01-1.414-.586m0 0L11 14h4a2 2 0 002-2V6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2v4l.586-.586z" />
                  </svg>
                </div>
                <span className="text-gray-700">Direct communication with the artisan</span>
              </div>
            </div>

            <button
              className={`w-full py-4 rounded-xl font-medium transition-colors ${
                activeTab === "buyer" 
                  ? "bg-gray-900 text-white hover:bg-gray-800" 
                  : "bg-gray-800 text-white hover:bg-gray-900"
              }`}
              onClick={activeTab === "buyer" ? handleBuyerClick : handleSellerClick}
            >
              {activeTab === "buyer" ? "Browse Products" : "Seller Login"}
            </button>

            <p className="text-center text-gray-500 text-sm mt-6">
              Connect directly with our local artisan for custom orders
            </p>
          </div>

          <div className="flex justify-center mt-8 space-x-6 text-gray-500 text-sm">
            <div className="text-center">
              <div className="font-semibold text-gray-700">100%</div>
              <div>Handmade</div>
            </div>
            <div className="text-center">
              <div className="font-semibold text-gray-700">Direct</div>
              <div>From Artisan</div>
            </div>
            <div className="text-center">
              <div className="font-semibold text-gray-700">1</div>
              <div>Premium Seller</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default HeroPage;
import React, { useState, useEffect } from "react";
import Navbar from "../../components/navbarBuyer/Navbar";
import HelpCenter from "../../components/HelpCenter";
import axios from "axios";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const Profile = () => {
  const [userData, setUserData] = useState({
    name: "",
    email: "",
    address: "",
    phone: "",
  });
  const [loading, setLoading] = useState(true);
  const [updating, setUpdating] = useState(false);

  useEffect(() => {
    fetchUserData();
  }, []);

  const fetchUserData = async () => {
    try {
      const token = localStorage.getItem("token");
      const response = await axios.get("http://localhost:5000/api/auth/me", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      setUserData({
        name: response.data.name || "",
        email: response.data.email || "",
        address: response.data.address || "",
        phone: response.data.phone || "",
      });
    } catch (error) {
      console.error("Error fetching user data:", error);
      toast.error("Failed to load profile data");
    } finally {
      setLoading(false);
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setUserData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setUpdating(true);

    try {
      const token = localStorage.getItem("token");
      await axios.put("http://localhost:5000/api/auth/profile", userData, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      toast.success("Profile updated successfully!");
    } catch (error) {
      console.error("Error updating profile:", error);
      toast.error("Failed to update profile");
    } finally {
      setUpdating(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex flex-col bg-gray-50">
        <Navbar />
        <div className="flex-1 flex items-center justify-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-black"></div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col bg-gray-50">
      <ToastContainer position="top-right" autoClose={3000} theme="colored" />

      <div className="fixed top-0 left-0 w-full z-50">
        <Navbar />
      </div>

      <div className="flex-1 px-4 md:px-6 py-14 mx-0 md:mx-4 lg:mx-20 xl:mx-40">
        <div className="max-w-3xl mx-auto">
          <div className="mb-8">
            <h1 className="text-3xl font-bold text-gray-900 mb-2">Profile</h1>
            <p className="text-gray-600">Manage your account information</p>
          </div>

          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 md:p-8">
            <div className="flex items-center gap-4 mb-8">
              <div className="w-16 h-16 bg-gray-900 rounded-full flex items-center justify-center">
                <span className="text-2xl font-bold text-white">
                  {userData.name?.charAt(0)?.toUpperCase() || "U"}
                </span>
              </div>
              <div>
                <h2 className="text-xl font-semibold text-gray-900">
                  {userData.name}
                </h2>
                <p className="text-gray-600">{userData.email}</p>
              </div>
            </div>

            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="md:col-span-2">
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Full Name
                  </label>
                  <input
                    type="text"
                    name="name"
                    value={userData.name}
                    onChange={handleInputChange}
                    className="w-full border border-gray-300 rounded-lg px-4 py-3 focus:ring-2 focus:ring-black focus:border-transparent outline-none transition-colors"
                    placeholder="Enter your full name"
                  />
                </div>
                <div className="md:col-span-2">
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Email Address
                  </label>
                  <input
                    type="email"
                    name="email"
                    value={userData.email}
                    onChange={handleInputChange}
                    className="w-full border border-gray-300 rounded-lg px-4 py-3 focus:ring-2 focus:ring-black focus:border-transparent outline-none transition-colors"
                    placeholder="Enter your email"
                  />
                </div>

                <div className="md:col-span-2">
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Phone Number
                  </label>
                  <input
                    type="tel"
                    name="phone"
                    value={userData.phone}
                    onChange={handleInputChange}
                    className="w-full border border-gray-300 rounded-lg px-4 py-3 focus:ring-2 focus:ring-black focus:border-transparent outline-none transition-colors"
                    placeholder="+94 807 779 777"
                  />
                </div>

                <div className="md:col-span-2">
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Address
                  </label>
                  <textarea
                    name="address"
                    value={userData.address}
                    onChange={handleInputChange}
                    rows={3}
                    className="w-full border border-gray-300 rounded-lg px-4 py-3 focus:ring-2 focus:ring-black focus:border-transparent outline-none transition-colors resize-none"
                    placeholder="Enter your complete address"
                  />
                </div>
              </div>

              <div className="flex justify-end pt-4">
                <button
                  type="submit"
                  disabled={updating}
                  className="bg-black text-white py-3 px-8 rounded-lg font-medium hover:bg-gray-800 transition-colors flex items-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {updating ? (
                    <>
                      <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                      Saving...
                    </>
                  ) : (
                    "Save Changes"
                  )}
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>

      <footer className="bg-black text-white px-4 md:px-10 py-10 mt-16">
        <div className="max-w-6xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-8 text-sm">
          <div>
            <p className="mb-4 font-bold text-lg">Cyber</p>
            <p className="text-gray-400">
              We are a residential interior design firm located in Portland. Our
              boutique-studio offers more than
            </p>
            <div className="flex gap-4 mt-4 text-lg">
              <i className="fab fa-twitter hover:text-gray-300 cursor-pointer transition-colors"></i>
              <i className="fab fa-facebook hover:text-gray-300 cursor-pointer transition-colors"></i>
              <i className="fab fa-tiktok hover:text-gray-300 cursor-pointer transition-colors"></i>
              <i className="fab fa-instagram hover:text-gray-300 cursor-pointer transition-colors"></i>
            </div>
          </div>

          <div>
            <p className="mb-4 font-bold text-lg">Services</p>
            <ul className="space-y-2 text-gray-400">
              {[
                "Bonus program",
                "Gift cards",
                "Credit and payment",
                "Service contracts",
                "Non-cash account",
                "Payment",
              ].map((item) => (
                <li
                  key={item}
                  className="hover:text-white cursor-pointer transition-colors"
                >
                  {item}
                </li>
              ))}
            </ul>
          </div>

          <div>
            <p className="mb-4 font-bold text-lg">Assistance to the buyer</p>
            <ul className="space-y-2 text-gray-400">
              {[
                "Find an order",
                "Terms of delivery",
                "Exchange and return of goods",
                "Guarantee",
                "Frequently asked questions",
                "Terms of use of the site",
              ].map((item) => (
                <li
                  key={item}
                  className="hover:text-white cursor-pointer transition-colors"
                >
                  {item}
                </li>
              ))}
            </ul>
          </div>
        </div>
      </footer>

      <HelpCenter />
    </div>
  );
};

export default Profile;

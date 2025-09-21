import React, { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import axios from "axios";
import { useCart } from "../../context/CartContext"; // ✅ Cart context import
import topBanner from "../../assets/top-banner.jpeg";
import bottomBanner from "../../assets/bottom-banner.jpeg";
import cat6 from "../../assets/cat-6.jpg";

const SignIn = () => {
  const [form, setForm] = useState({ email: "", password: "" });
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const { clearCartContext, mergeGuestCartWithUser } = useCart(); // ✅ Cart functions

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      const res = await axios.post("http://localhost:5000/api/auth/login", {
        email: form.email.trim().toLowerCase(),
        password: form.password,
        role: "buyer",
      });

      if (res.data.user.role !== "buyer") {
        setLoading(false);
        return setError("Please login from Buyer Login section.");
      }

      localStorage.setItem("token", res.data.token);
      localStorage.setItem("role", res.data.user.role);

      clearCartContext();
      await mergeGuestCartWithUser(); 

      setForm({ email: "", password: "" });
      navigate("/home");
    } catch (err) {
      setError(err.response?.data?.message || "Invalid email or password");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex flex-col lg:flex-row font-sans bg-gray-50">
      <div className="lg:w-2/5 flex flex-col items-center justify-center p-10 bg-gray-900 text-white">
        <div className="text-center mb-10">
          <h1 className="text-5xl font-bold mb-4">LOCALUP</h1>
          <p className="text-xl text-gray-300 mb-8">
            Direct Marketplace Connecting You to Local Artisans
          </p>

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
            <span className="text-gray-300 text-center">
              Handcrafted with care by local artisans
            </span>
          </div>
        </div>
      </div>

      <div className="lg:w-3/5 flex items-center justify-center p-10">
        <div className="w-full max-w-md">
          <div className="text-center mb-10">
            <h2 className="text-3xl font-bold text-gray-900 mb-2">
              Buyer Login
            </h2>
            <p className="text-gray-600">
              Discover exclusive handmade products
            </p>
          </div>

          <div className="bg-white rounded-2xl shadow-xl p-8 border border-gray-200">
            {error && (
              <div className="mb-6 p-3 bg-red-50 text-red-700 rounded-lg text-sm">
                {error}
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Email
                </label>
                <input
                  type="email"
                  name="email"
                  value={form.email}
                  onChange={handleChange}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-gray-500 focus:border-transparent transition-colors"
                  placeholder="Enter your email"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Password
                </label>
                <input
                  type="password"
                  name="password"
                  value={form.password}
                  onChange={handleChange}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-gray-500 focus:border-transparent transition-colors"
                  placeholder="Enter your password"
                  required
                />
              </div>

              <button
                type="submit"
                disabled={loading}
                className={`w-full py-4 rounded-xl font-medium transition-colors ${
                  loading
                    ? "bg-gray-400 cursor-not-allowed"
                    : "bg-gray-900 text-white hover:bg-gray-800"
                }`}
              >
                {loading ? "Signing in..." : "Sign In"}
              </button>
            </form>

            <div className="mt-6 text-center">
              <p className="text-gray-600 text-sm">
                Don't have an account?{" "}
                <span className="font-medium text-gray-800">
                  Register now to explore unique products
                </span>
              </p>

              <Link to="/signUp">
                <button className="mt-4 w-full border border-gray-800 text-gray-800 py-3 rounded-xl hover:bg-gray-50 transition-colors font-medium">
                  Register Now
                </button>
              </Link>
            </div>
          </div>

          <div className="flex justify-center mt-8 space-x-6 text-gray-500 text-sm">
            <div className="text-center">
              <div className="font-semibold text-gray-700">Secure</div>
              <div>Checkout</div>
            </div>
            <div className="text-center">
              <div className="font-semibold text-gray-700">Direct</div>
              <div>From Artisan</div>
            </div>
            <div className="text-center">
              <div className="font-semibold text-gray-700">50+</div>
              <div>Unique Products</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SignIn;

import React, { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import axios from "axios";
import { useCart } from "../../context/CartContext"; 
import topBanner from "../../assets/top-banner.jpeg";
import bottomBanner from "../../assets/bottom-banner.jpeg";
import cat6 from "../../assets/cat-6.jpg";

const SignUp = () => {
  const [form, setForm] = useState({
    firstName: "",
    lastName: "",
    email: "",
    password: "",
    phone: "",
    address: "",
  });
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const { clearCartContext } = useCart(); 
  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const validate = () => {
    if (
      !form.firstName ||
      !form.lastName ||
      !form.email ||
      !form.password ||
      !form.phone ||
      !form.address
    )
      return "All fields are required";

    if (!/\S+@\S+\.\S+/.test(form.email)) return "Invalid email format";
    if (form.password.length < 6)
      return "Password must be at least 6 characters";
    if (!/^\d{10}$/.test(form.phone)) return "Phone number must be 10 digits";

    return null;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const validationError = validate();
    if (validationError) return setError(validationError);

    setLoading(true);
    setError("");

    try {
      await axios.post("http://localhost:5000/api/auth/register", {
        name: `${form.firstName} ${form.lastName}`,
        email: form.email,
        password: form.password,
        phone: form.phone,
        address: form.address,
        role: "buyer",
      });

      clearCartContext();
      navigate("/signIn");
    } catch (err) {
      setError(err.response?.data?.message || "Registration failed");
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

      {/* s Registration Form */}
      <div className="lg:w-3/5 flex items-center justify-center p-10">
        <div className="w-full max-w-md">
          <div className="text-center mb-10">
            <h2 className="text-3xl font-bold text-gray-900 mb-2">
              Create Account
            </h2>
            <p className="text-gray-600">
              Join us to discover unique handmade products
            </p>
          </div>

          {/* Card Container */}
          <div className="bg-white rounded-2xl shadow-xl p-8 border border-gray-200">
            {error && (
              <div className="mb-6 p-3 bg-red-50 text-red-700 rounded-lg text-sm">
                {error}
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    First Name
                  </label>
                  <input
                    name="firstName"
                    type="text"
                    value={form.firstName}
                    onChange={handleChange}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-gray-500 focus:border-transparent transition-colors"
                    placeholder="First Name"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Last Name
                  </label>
                  <input
                    name="lastName"
                    type="text"
                    value={form.lastName}
                    onChange={handleChange}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-gray-500 focus:border-transparent transition-colors"
                    placeholder="Last Name"
                    required
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Email
                </label>
                <input
                  name="email"
                  type="email"
                  value={form.email}
                  onChange={handleChange}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-gray-500 focus:border-transparent transition-colors"
                  placeholder="Email Address"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Password
                </label>
                <input
                  name="password"
                  type="password"
                  value={form.password}
                  onChange={handleChange}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-gray-500 focus:border-transparent transition-colors"
                  placeholder="Password (min. 6 characters)"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Phone Number
                </label>
                <input
                  name="phone"
                  type="text"
                  value={form.phone}
                  onChange={handleChange}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-gray-500 focus:border-transparent transition-colors"
                  placeholder="10-digit Phone Number"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Address
                </label>
                <input
                  name="address"
                  type="text"
                  value={form.address}
                  onChange={handleChange}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-gray-500 focus:border-transparent transition-colors"
                  placeholder="Delivery Address"
                  required
                />
              </div>

              <button
                type="submit"
                disabled={loading}
                className={`w-full py-4 rounded-xl font-medium transition-colors mt-6 ${
                  loading
                    ? "bg-gray-400 cursor-not-allowed"
                    : "bg-gray-900 text-white hover:bg-gray-800"
                }`}
              >
                {loading ? (
                  <div className="flex items-center justify-center gap-2">
                    <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                    <span>Creating Account...</span>
                  </div>
                ) : (
                  "Create Account"
                )}
              </button>
            </form>

            <div className="mt-6 text-center">
              <p className="text-gray-600 text-sm">
                Already have an account?{" "}
                <Link
                  to="/signIn"
                  className="font-medium text-gray-800 hover:underline"
                >
                  Sign in here
                </Link>
              </p>
            </div>
          </div>

          {/* Platform Stats */}
          <div className="flex justify-center mt-8 space-x-6 text-gray-500 text-sm">
            <div className="text-center">
              <div className="font-semibold text-gray-700">Secure</div>
              <div>Registration</div>
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

export default SignUp;

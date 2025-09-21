import React, { useState } from "react";
import Navbar from "../../components/navbarBuyer/Navbar";
import HelpCenter from "../../components/HelpCenter";
import axios from "axios";
import { toast } from "react-toastify";

const Contact = () => {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    message: "",
  });
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const response = await axios.post(
        "http://localhost:5000/api/contact/send",
        formData
      );

      if (response.data.success) {
        toast.success(response.data.message || "Message sent successfully!");

        // Reset form
        setFormData({
          name: "",
          email: "",
          phone: "",
          message: "",
        });
      } else {
        toast.error(response.data.message || "Failed to send message.");
      }
    } catch (error) {
      console.error("Error sending message:", error);
      const errorMessage =
        error.response?.data?.message ||
        "Failed to send message. Please try again.";
      toast.error(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-gray-50 text-gray-800 font-sans min-h-screen">
      <div className="fixed top-0 left-0 w-full z-50">
        <Navbar />
      </div>

      <div className="pt-20"></div>

      <section className="bg-gradient-to-r from-gray-900 to-black text-white py-20">
        <div className="max-w-7xl mx-auto px-6 text-center">
          <h1 className="text-5xl font-bold mb-6">Get In Touch</h1>
          <p className="text-xl text-gray-300 max-w-2xl mx-auto">
            We'd love to hear from you. Let's start a conversation.
          </p>
        </div>
      </section>

      <section className="max-w-7xl mx-auto py-20 px-6">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16">
          <div className="space-y-10">
            <div>
              <h2 className="text-4xl font-bold mb-8 text-gray-900">
                Contact Information
              </h2>
              <p className="text-lg text-gray-600 mb-10">
                Have questions or want to discuss with us? Reach out to us
                through any of these channels.
              </p>
            </div>

            <div className="flex items-start gap-6 p-6 bg-white rounded-xl shadow-lg hover:shadow-xl transition-shadow duration-300">
              <div className="bg-gray-100 p-4 rounded-full flex-shrink-0">
                <i className="fas fa-phone text-gray-700 text-xl"></i>
              </div>
              <div>
                <h4 className="text-xl font-semibold mb-2">Call To Us</h4>
                <p className="text-gray-600 mb-2">
                  We are available 24/7, 7 days a week.
                </p>
                <p className="font-bold text-gray-900">+94703452278</p>
              </div>
            </div>

            <div className="flex items-start gap-6 p-6 bg-white rounded-xl shadow-lg hover:shadow-xl transition-shadow duration-300">
              <div className="bg-gray-100 p-4 rounded-full flex-shrink-0">
                <i className="fas fa-envelope text-gray-700 text-xl"></i>
              </div>
              <div>
                <h4 className="text-xl font-semibold mb-2">Write To US</h4>
                <p className="text-gray-600 mb-2">
                  Fill out our form and we will contact you within 24 hours.
                </p>
                <div className="space-y-1">
                  <p className="text-gray-900 font-medium">
                    customer@exclusive.com
                  </p>
                  <p className="text-gray-900 font-medium">
                    support@exclusive.com
                  </p>
                </div>
              </div>
            </div>

            <div className="flex items-start gap-6 p-6 bg-white rounded-xl shadow-lg hover:shadow-xl transition-shadow duration-300">
              <div className="bg-gray-100 p-4 rounded-full flex-shrink-0">
                <i className="fas fa-map-marker-alt text-gray-700 text-xl"></i>
              </div>
              <div>
                <h4 className="text-xl font-semibold mb-2">Visit Us</h4>
                <p className="text-gray-600 mb-2">
                  Come see us at our headquarters.
                </p>
                <p className="text-gray-900 font-medium">
                  123 Business Avenue, Kotikawaththa, colombo 07
                </p>
              </div>
            </div>
          </div>

          <div className="bg-white p-10 rounded-2xl shadow-xl">
            <h3 className="text-3xl font-bold mb-8 text-gray-900">
              Send us a Message
            </h3>

            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label
                    htmlFor="name"
                    className="block text-sm font-medium text-gray-700 mb-2"
                  >
                    Your Name *
                  </label>
                  <input
                    id="name"
                    name="name"
                    type="text"
                    required
                    value={formData.name}
                    onChange={handleChange}
                    placeholder="Enter your full name"
                    className="w-full px-5 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-gray-800 focus:border-transparent outline-none transition-colors"
                  />
                </div>

                <div>
                  <label
                    htmlFor="email"
                    className="block text-sm font-medium text-gray-700 mb-2"
                  >
                    Your Email *
                  </label>
                  <input
                    id="email"
                    name="email"
                    type="email"
                    required
                    value={formData.email}
                    onChange={handleChange}
                    placeholder="Enter your email address"
                    className="w-full px-5 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-gray-800 focus:border-transparent outline-none transition-colors"
                  />
                </div>
              </div>

              <div>
                <label
                  htmlFor="phone"
                  className="block text-sm font-medium text-gray-700 mb-2"
                >
                  Your Phone *
                </label>
                <input
                  id="phone"
                  name="phone"
                  type="tel"
                  required
                  value={formData.phone}
                  onChange={handleChange}
                  placeholder="Enter your phone number"
                  className="w-full px-5 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-gray-800 focus:border-transparent outline-none transition-colors"
                />
              </div>

              <div>
                <label
                  htmlFor="message"
                  className="block text-sm font-medium text-gray-700 mb-2"
                >
                  Your Message *
                </label>
                <textarea
                  id="message"
                  name="message"
                  rows={5}
                  required
                  value={formData.message}
                  onChange={handleChange}
                  placeholder="Tell us how we can help you..."
                  className="w-full px-5 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-gray-800 focus:border-transparent outline-none transition-colors resize-none"
                ></textarea>
              </div>

              <div className="text-right">
                <button
                  type="submit"
                  disabled={loading}
                  className={`bg-gray-900 text-white px-8 py-4 rounded-lg font-semibold transition-colors duration-300 transform hover:-translate-y-1 shadow-lg hover:shadow-xl ${
                    loading ? "opacity-50 cursor-not-allowed" : "hover:bg-black"
                  }`}
                >
                  {loading ? (
                    <div className="flex items-center justify-center">
                      <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-2"></div>
                      Sending...
                    </div>
                  ) : (
                    "Send Message"
                  )}
                </button>
              </div>
            </form>
          </div>
        </div>
      </section>

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
};

export default Contact;

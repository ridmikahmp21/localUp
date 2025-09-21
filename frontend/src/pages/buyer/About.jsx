import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import Navbar from "../../components/navbarBuyer/Navbar";
import HelpCenter from "../../components/HelpCenter";
import mask from "../../assets/beg.jpeg";
import jwe from "../../assets/grow.jpeg";
import dir1 from "../../assets/dir1.jpeg";
import dir2 from "../../assets/dir2.jpeg";
import dir3 from "../../assets/dir3.jpeg";

const About = () => {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    setIsVisible(true);
  }, []);

  return (
    <div className="bg-white text-gray-800 font-sans min-h-screen overflow-x-hidden">
      <div className="fixed top-0 left-0 w-full z-50">
        <Navbar />
      </div>

      <div className="pt-20"></div>

      <section
        className={`relative py-28 bg-black text-white transition-all duration-1000 ${
          isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-10"
        }`}
      >
        <div className="max-w-7xl mx-auto px-6 text-center">
          <h1 className="text-6xl font-bold mb-6 text-white">Our Story</h1>
          <div className="w-32 h-1 bg-gray-500 mx-auto mb-8"></div>
          <p className="text-2xl text-gray-300 max-w-3xl mx-auto">
            Pioneering e-commerce excellence in South Asia since 2015
          </p>
        </div>
      </section>

      {/* Our Story Section */}
      <section className="max-w-7xl mx-auto px-6 py-24">
        <div className="flex flex-col lg:flex-row items-center gap-16 mb-24">
          <div className="w-full lg:w-1/2 relative group">
            <div className="absolute -inset-4 bg-gray-200 rounded-2xl -z-10 group-hover:bg-gray-300 transition-all duration-500"></div>
            <div className="overflow-hidden rounded-2xl shadow-2xl">
              <img
                src={mask}
                alt="Team collaboration"
                className="w-full h-[450px] object-cover transform group-hover:scale-105 transition-transform duration-700"
              />
            </div>
          </div>

          <div className="w-full lg:w-1/2">
            <h2 className="text-5xl font-bold mb-8 text-gray-900">
              From Humble Beginnings
            </h2>
            <p className="mb-8 text-xl text-gray-700 leading-relaxed border-l-4 border-gray-500 pl-6">
              Launched in 2015, Exclusive is South Asia's premier online
              shopping marketplace with an active presence in Bangladesh.
              Supported by a wide range of tailored marketing, data, and service
              solutions.
            </p>
            <p className="text-xl text-gray-700 leading-relaxed">
              Exclusive has 10,500 sellers and 300 brands and serves 3 million
              customers across the region with more than 1 Million products to
              offer, growing at a very fast pace.
            </p>
          </div>
        </div>

        <div className="flex flex-col lg:flex-row-reverse items-center gap-16">
          <div className="w-full lg:w-1/2 relative group">
            <div className="absolute -inset-4 bg-gray-200 rounded-2xl -z-10 group-hover:bg-gray-300 transition-all duration-500"></div>
            <div className="overflow-hidden rounded-2xl shadow-2xl">
              <img
                src={jwe}
                alt="Our growth"
                className="w-full h-[450px] object-cover transform group-hover:scale-105 transition-transform duration-700"
              />
            </div>
          </div>

          <div className="w-full lg:w-1/2">
            <h2 className="text-5xl font-bold mb-8 text-gray-900">
              Our Growth Journey
            </h2>
            <p className="mb-8 text-xl text-gray-700 leading-relaxed border-l-4 border-gray-500 pl-6">
              Exclusive offers a diverse assortment in categories ranging from
              consumer electronics to fashion, home goods, and lifestyle
              products.
            </p>
            <p className="text-xl text-gray-700 leading-relaxed">
              Our commitment to quality, customer satisfaction, and
              technological innovation has been the driving force behind our
              rapid expansion and market leadership.
            </p>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-24 bg-gray-100 relative overflow-hidden">
        <div className="absolute top-0 left-0 w-full h-1 bg-gray-500"></div>
        <div className="max-w-7xl mx-auto px-6 relative z-10">
          <div className="text-center mb-20">
            <h2 className="text-5xl font-bold text-gray-900 mb-6">
              Our Impact in Numbers
            </h2>
            <div className="w-24 h-1 bg-gray-600 mx-auto mb-8"></div>
            <p className="text-2xl text-gray-600 max-w-2xl mx-auto">
              Measuring success through our growing community and marketplace
              activity
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {[
              { label: "Sellers active our site", value: "10.5k" },
              { label: "Monthly Product Sale", value: "33k", highlight: true },
              { label: "Customer active in our site", value: "45.5k" },
              { label: "Annual gross sale in our site", value: "25k" },
            ].map((stat, i) => (
              <div
                key={i}
                className={`p-10 rounded-2xl text-center transition-all duration-500 hover:scale-105 hover:-translate-y-2 ${
                  stat.highlight
                    ? "bg-gray-900 text-white shadow-2xl"
                    : "bg-white border border-gray-300 shadow-xl"
                }`}
              >
                <div
                  className={`text-6xl font-bold mb-4 ${
                    stat.highlight ? "text-white" : "text-gray-900"
                  }`}
                >
                  {stat.value}
                </div>
                <p
                  className={`text-lg font-medium ${
                    stat.highlight ? "text-gray-300" : "text-gray-600"
                  }`}
                >
                  {stat.label}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Values Section */}
      <section className="py-24 bg-white relative">
        <div className="max-w-7xl mx-auto px-6 relative z-10">
          <div className="text-center mb-20">
            <h2 className="text-5xl font-bold text-gray-900 mb-6">
              Our Core Values
            </h2>
            <div className="w-24 h-1 bg-gray-600 mx-auto mb-8"></div>
            <p className="text-2xl text-gray-600 max-w-2xl mx-auto">
              The principles that guide everything we do
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
            {[
              {
                title: "Customer First",
                description:
                  "We prioritize our customers' needs and strive to deliver exceptional shopping experiences every day.",
                icon: "■",
              },
              {
                title: "Innovation",
                description:
                  "We continuously evolve our platform with cutting-edge technology to stay ahead of market trends.",
                icon: "●",
              },
              {
                title: "Integrity",
                description:
                  "We conduct business with honesty, transparency, and respect for all stakeholders.",
                icon: "▲",
              },
            ].map((value, i) => (
              <div
                key={i}
                className="bg-white p-10 rounded-2xl border border-gray-300 shadow-xl text-center hover:shadow-2xl transition-all duration-500 group"
              >
                <div className="inline-flex items-center justify-center w-24 h-24 rounded-full bg-gray-900 text-white text-4xl mb-8 group-hover:scale-110 transition-transform duration-500">
                  {value.icon}
                </div>
                <h3 className="text-3xl font-bold text-gray-900 mb-6">
                  {value.title}
                </h3>
                <p className="text-xl text-gray-600">{value.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Directors Section */}
      <section className="py-24 px-6 bg-gray-950 text-white relative overflow-hidden">
        <div className="absolute top-0 left-0 w-full h-1 bg-gray-500"></div>
        <div className="max-w-7xl mx-auto relative z-10">
          <div className="text-center mb-20">
            <span className="text-gray-400 font-semibold text-lg uppercase tracking-wide">
              Leadership
            </span>
            <h2 className="text-5xl font-bold mt-4 mb-6">
              Our Board of Directors
            </h2>
            <div className="w-24 h-1 bg-gray-500 mx-auto mb-8"></div>
            <p className="text-2xl text-gray-300 max-w-2xl mx-auto">
              Visionary leaders guiding our company to new heights
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
            {[
              { name: "Tom Cruise", title: "Founder & Chairman", img: dir1 },
              { name: "Emma Watson", title: "Managing Director", img: dir2 },
              { name: "Will Smith", title: "Product Designer", img: dir3 },
            ].map((director, i) => (
              <div key={i} className="text-center group">
                <div className="relative overflow-hidden rounded-2xl mb-8 h-96 shadow-2xl">
                  <div className="h-full flex items-center justify-center overflow-hidden">
                    <img
                      src={director.img}
                      alt={director.name}
                      className="w-full h-auto max-h-full object-contain transform group-hover:scale-105 transition-transform duration-700"
                      style={{ objectPosition: "top center" }}
                    />
                  </div>
                  {/* Social icons appear on hover */}
                  <div className="absolute inset-0 bg-black/0 group-hover:bg-black/40 transition-all duration-500 flex items-end justify-center pb-4">
                    <div className="flex justify-center gap-4 text-white text-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-500">
                      <button className="bg-white/20 p-2 rounded-full hover:bg-white/30 transition-all duration-300 hover:scale-110">
                        <i className="fab fa-twitter"></i>
                      </button>
                      <button className="bg-white/20 p-2 rounded-full hover:bg-white/30 transition-all duration-300 hover:scale-110">
                        <i className="fab fa-instagram"></i>
                      </button>
                      <button className="bg-white/20 p-2 rounded-full hover:bg-white/30 transition-all duration-300 hover:scale-110">
                        <i className="fab fa-linkedin"></i>
                      </button>
                    </div>
                  </div>
                </div>
                <h4 className="text-2xl font-bold mt-4">{director.name}</h4>
                <p className="text-gray-400 mt-2 text-lg">{director.title}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-24 bg-slate-200 text-slate-900 relative overflow-hidden">
        <div className="max-w-5xl mx-auto px-6 text-center relative z-10">
          <h2 className="text-5xl font-bold mb-8">
            Ready to Experience Exclusive?
          </h2>
          <p className="text-2xl mb-12 max-w-2xl mx-auto text-gray-700">
            Join millions of satisfied customers and discover why we're South
            Asia's premier online marketplace.
          </p>
        </div>
      </section>

      {/* Bottom Banner */}
      <section className="bg-black text-white py-20 px-10 text-center relative overflow-hidden">
        <div className="absolute top-0 left-0 w-full h-1 bg-gray-500"></div>
        <div className="relative z-10">
          <h2 className="text-5xl font-bold mb-6">
            Big Summer <span className="text-gray-400">Sale</span>
          </h2>
          <p className="text-xl mb-10 max-w-2xl mx-auto text-gray-300">
            Commodo fames vitae vitae leo mauris in. Eu consequat.
          </p>
          <Link
            to={'/home'}
          >
            <button className="bg-white text-black px-10 py-4 rounded-xl font-bold text-lg hover:scale-105 transition-transform duration-300 shadow-2xl">
              Shop Now
            </button>
          </Link>
        </div>
      </section>

      {/* Footer */}
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
      </footer>
      <HelpCenter />
    </div>
  );
};

export default About;

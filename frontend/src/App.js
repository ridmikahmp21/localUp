import { BrowserRouter, Routes, Route } from "react-router-dom";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { CartProvider } from "./context/CartContext";
import CartSync from "./components/CartSync";
import ProtectedRoute from "./components/ProtectedRoute";

// auth
import HeroPage from "./pages/auth/HeroPage";
import SignIn from "./pages/auth/SignIn";
import SignUp from "./pages/auth/SignUp";
import SignInSeller from "./pages/auth/SignInSeller";

// buyer
import Profile from "./pages/buyer/Profile";
import About from "./pages/buyer/About";
import Contact from "./pages/buyer/Contact";
import Community from "./pages/buyer/Community";
import Cart from "./pages/buyer/Cart";
import CheckoutPayment from "./pages/buyer/CheckoutPayment";
import CheckoutSuccess from "./pages/buyer/CheckoutSuccess";
import OrderBuyer from "./pages/buyer/OrderBuyer";
import HomePage from "./pages/buyer/Home";
import CategoryPage from "./pages/buyer/CategoryPage";
import ProductDetails from "./pages/buyer/ProductDetails";
import Chatbot from "./pages/buyer/Chatbot";

// seller
import Dashboard from "./pages/seller/Dashboard";
import AddProduct from "./pages/seller/AddProduct";
import EditProduct from "./pages/seller/EditProduct";
import DeleteProduct from "./pages/seller/DeleteProducts";
import Product from "./pages/seller/Product";
import Order from "./pages/seller/Order";
import Payment from "./pages/seller/Payment";
import Blog from "./pages/seller/Blog";

function App() {
  return (
    <CartProvider>
      <CartSync />
      <BrowserRouter>
        <ToastContainer
          position="top-right"
          autoClose={3000}
          hideProgressBar={false}
          newestOnTop={false}
          closeOnClick
          rtl={false}
          pauseOnFocusLoss
          draggable
          pauseOnHover
          theme="light"
        />
        <Routes>
          {/* auth */}
          <Route path="/" element={<HeroPage />} />
          <Route path="/signIn" element={<SignIn />} />
          <Route path="/signUp" element={<SignUp />} />
          <Route path="/signInSeller" element={<SignInSeller />} />
          {/* buyer */}
          <Route path="/profile" element={<Profile />} />
          <Route path="/about" element={<About />} />
          <Route path="/contact" element={<Contact />} />
          <Route path="/community" element={<Community />} />
          <Route
            path="/cart"
            element={
              <ProtectedRoute>
                {" "}
                <Cart />{" "}
              </ProtectedRoute>
            }
          />
          <Route
            path="/checkout"
            element={
              <ProtectedRoute>
                {" "}
                <CheckoutPayment />{" "}
              </ProtectedRoute>
            }
          />
          <Route
            path="/checkout/success"
            element={
              <ProtectedRoute>
                {" "}
                <CheckoutSuccess />{" "}
              </ProtectedRoute>
            }
          />
          <Route
            path="/orderBuyer"
            element={
              <ProtectedRoute>
                {" "}
                <OrderBuyer />{" "}
              </ProtectedRoute>
            }
          />
          <Route path="/home" element={<HomePage />} />
          <Route path="/category/:categoryName" element={<CategoryPage />} />
          <Route path="/product/:productId" element={<ProductDetails />} />
          <Route path="/chatbot" element={<Chatbot />} />
          {/* seller */}
          <Route path="/addProduct" element={<AddProduct />} />
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/deleteProduct/:id" element={<DeleteProduct />} />
          <Route path="/editProduct/:id" element={<EditProduct />} />
          <Route path="/orders" element={<Order />} />
          <Route path="/products" element={<Product />} />
          <Route path="/payments" element={<Payment />} />
          <Route path="/blog" element={<Blog />} />
        </Routes>
      </BrowserRouter>
    </CartProvider>
  );
}

export default App;

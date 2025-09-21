import { useEffect } from "react";
import { useCart } from "../context/CartContext";

const CartSync = () => {
  const { clearCartContext, fetchCartFromBackend } = useCart();

  useEffect(() => {
    const token = localStorage.getItem("token");
    const role = localStorage.getItem("role");

    if (!token || role !== "buyer") return;

    clearCartContext();
    fetchCartFromBackend();
  }, [clearCartContext, fetchCartFromBackend]);

  return null;
};

export default CartSync;

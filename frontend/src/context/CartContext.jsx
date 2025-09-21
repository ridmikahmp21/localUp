import React, {
  createContext,
  useContext,
  useReducer,
  useEffect,
  useCallback,
  useState,
} from "react";
import axios from "axios";
import { toast } from "react-toastify";

const CartContext = createContext();

const cartReducer = (state, action) => {
  switch (action.type) {
    case "SET_CART":
      return { ...state, items: action.payload };
    case "ADD_TO_CART":
      const existingItemIndex = state.items.findIndex(
        (item) => item.product._id === action.payload.product._id
      );

      if (existingItemIndex >= 0) {
        const newItems = [...state.items];
        newItems[existingItemIndex] = {
          ...newItems[existingItemIndex],
          quantity:
            newItems[existingItemIndex].quantity + action.payload.quantity,
        };
        return { ...state, items: newItems };
      } else {
        return { ...state, items: [...state.items, action.payload] };
      }
    case "UPDATE_QUANTITY":
      return {
        ...state,
        items: state.items.map((item) =>
          item.product._id === action.payload.productId
            ? { ...item, quantity: action.payload.quantity }
            : item
        ),
      };
    case "REMOVE_FROM_CART":
      return {
        ...state,
        items: state.items.filter(
          (item) => item.product._id !== action.payload
        ),
      };
    case "CLEAR_CART":
      return { ...state, items: [] };
    default:
      return state;
  }
};

export const CartProvider = ({ children }) => {
  const [state, dispatch] = useReducer(cartReducer, { items: [] });
  const [loading, setLoading] = useState(false);

  const getAuthHeader = () => {
    const token = localStorage.getItem("token");
    return token ? { Authorization: `Bearer ${token}` } : {};
  };

  useEffect(() => {
    const token = localStorage.getItem("token");
    const role = localStorage.getItem("role");

    if (!token || role !== "buyer") {
      const guestCart = JSON.parse(localStorage.getItem("guestCart") || "[]");
      dispatch({ type: "SET_CART", payload: guestCart });
    }
  }, []);

  const fetchCartFromBackend = useCallback(async () => {
    const token = localStorage.getItem("token");
    const role = localStorage.getItem("role");
    if (!token || role !== "buyer") return;

    try {
      const res = await axios.get("http://localhost:5000/api/cart", {
        headers: { Authorization: `Bearer ${token}` },
      });
      dispatch({ type: "SET_CART", payload: res.data.items || [] });
    } catch (err) {
      console.error("Cart error:", err);
    }
  }, []);

  const mergeGuestCartWithUser = useCallback(async () => {
    const guestCart = JSON.parse(localStorage.getItem("guestCart") || "[]");

    if (guestCart.length > 0) {
      try {
        for (const item of guestCart) {
          await axios.post(
            "http://localhost:5000/api/cart/add",
            { productId: item.product._id, quantity: item.quantity },
            { headers: getAuthHeader() }
          );
        }
        localStorage.removeItem("guestCart");
        await fetchCartFromBackend();
      } catch (err) {
        console.error("Failed to merge guest cart:", err);
        toast.error("Failed to merge your guest cart items");
      }
    }
  }, [fetchCartFromBackend]);

  const addToCart = async (product, quantity = 1) => {
    const token = localStorage.getItem("token");
    const role = localStorage.getItem("role");

    if (!token || role !== "buyer") {
      const guestCart = JSON.parse(localStorage.getItem("guestCart") || "[]");

      const existingItemIndex = guestCart.findIndex(
        (item) => item.product._id === product._id
      );

      if (existingItemIndex >= 0) {
        guestCart[existingItemIndex].quantity += quantity;
      } else {
        guestCart.push({
          product: {
            _id: product._id,
            name: product.name,
            image: product.image,
            price: product.price,
            description: product.description,
          },
          quantity: quantity,
        });
      }

      localStorage.setItem("guestCart", JSON.stringify(guestCart));

      dispatch({
        type: "ADD_TO_CART",
        payload: {
          product: {
            _id: product._id,
            name: product.name,
            image: product.image,
            price: product.price,
            description: product.description,
          },
          quantity: quantity,
        },
      });

      toast.success(`${product.name} added to cart!`);
      return;
    }

    if (!quantity || quantity < 1) {
      toast.error("Invalid quantity");
      return;
    }

    toast.success(`${product.name} added to cart!`, {
      toastId: `cart-add-${product._id}-${Date.now()}`,
      autoClose: 3000,
    });

    dispatch({
      type: "ADD_TO_CART",
      payload: {
        product: {
          _id: product._id,
          name: product.name,
          image: product.image,
          price: product.price,
          description: product.description,
        },
        quantity: quantity,
      },
    });

    setLoading(true);
    try {
      await axios.post(
        "http://localhost:5000/api/cart/add",
        { productId: product._id, quantity },
        { headers: getAuthHeader() }
      );
      await fetchCartFromBackend();
    } catch (err) {
      console.error("Cart error:", err);
      fetchCartFromBackend();

      if (!err.response || err.response.status !== 409) {
        toast.error(
          err.response?.data?.message || "Failed to add item to cart.",
          {
            toastId: `cart-error-${product._id}`,
          }
        );
      }
    } finally {
      setLoading(false);
    }
  };

  const updateQuantity = async (productId, quantity) => {
    const token = localStorage.getItem("token");
    const role = localStorage.getItem("role");

    if (!token || role !== "buyer") {
      const guestCart = JSON.parse(localStorage.getItem("guestCart") || "[]");
      const itemIndex = guestCart.findIndex(
        (item) => item.product._id === productId
      );

      if (itemIndex >= 0) {
        if (quantity < 1) {
          guestCart.splice(itemIndex, 1);
        } else {
          guestCart[itemIndex].quantity = quantity;
        }

        localStorage.setItem("guestCart", JSON.stringify(guestCart));

        if (quantity < 1) {
          dispatch({ type: "REMOVE_FROM_CART", payload: productId });
        } else {
          dispatch({
            type: "UPDATE_QUANTITY",
            payload: { productId, quantity },
          });
        }
      }
      return;
    }

    if (!quantity || quantity < 1) {
      toast.error("Invalid quantity");
      return;
    }

    dispatch({
      type: "UPDATE_QUANTITY",
      payload: { productId, quantity },
    });

    setLoading(true);
    try {
      await axios.put(
        `http://localhost:5000/api/cart/update/${productId}`,
        { quantity },
        { headers: getAuthHeader() }
      );
      await fetchCartFromBackend();
    } catch (err) {
      console.error("Cart error:", err);
      fetchCartFromBackend();
      toast.error(err.response?.data?.message || "Failed to update quantity.", {
        toastId: `update-error-${productId}`,
      });
    } finally {
      setLoading(false);
    }
  };

  const removeFromCart = async (productId) => {
    const token = localStorage.getItem("token");
    const role = localStorage.getItem("role");

    if (!token || role !== "buyer") {
      const guestCart = JSON.parse(localStorage.getItem("guestCart") || "[]");
      const updatedCart = guestCart.filter(
        (item) => item.product._id !== productId
      );

      localStorage.setItem("guestCart", JSON.stringify(updatedCart));

      dispatch({ type: "REMOVE_FROM_CART", payload: productId });
      return;
    }

    dispatch({
      type: "REMOVE_FROM_CART",
      payload: productId,
    });

    setLoading(true);
    try {
      await axios.delete(`http://localhost:5000/api/cart/remove/${productId}`, {
        headers: getAuthHeader(),
      });
      await fetchCartFromBackend();
    } catch (err) {
      console.error("Cart error:", err);
      fetchCartFromBackend();
      toast.error(err.response?.data?.message || "Failed to remove item.", {
        toastId: `remove-error-${productId}`,
      });
    } finally {
      setLoading(false);
    }
  };

  const clearCart = async () => {
    const token = localStorage.getItem("token");
    const role = localStorage.getItem("role");

    if (!token || role !== "buyer") {
      localStorage.removeItem("guestCart");

      dispatch({ type: "CLEAR_CART" });
      toast.success("Cart cleared.");
      return;
    }

    dispatch({ type: "CLEAR_CART" });

    toast.success("Cart cleared.", {
      toastId: "cart-clear",
      autoClose: 3000,
    });

    setLoading(true);
    try {
      await axios.delete("http://localhost:5000/api/cart/clear", {
        headers: getAuthHeader(),
      });
      await fetchCartFromBackend();
    } catch (err) {
      console.error("Cart error:", err);
      fetchCartFromBackend();
      toast.error(err.response?.data?.message || "Failed to clear cart.", {
        toastId: "clear-error",
      });
    } finally {
      setLoading(false);
    }
  };

  const clearCartContext = useCallback(() => {
    dispatch({ type: "CLEAR_CART" });
  }, []);

  const getCartItemsCount = () => {
    return state.items.reduce((total, item) => total + item.quantity, 0);
  };

  const getCartTotal = () => {
    return state.items.reduce((total, item) => {
      const price = Number(item.product?.price) || 0;
      return total + price * item.quantity;
    }, 0);
  };

  useEffect(() => {
    const token = localStorage.getItem("token");
    const role = localStorage.getItem("role");

    if (token && role === "buyer") {
      fetchCartFromBackend();
    }
  }, [fetchCartFromBackend]);

  return (
    <CartContext.Provider
      value={{
        items: state.items,
        loading,
        addToCart,
        updateQuantity,
        removeFromCart,
        clearCart,
        clearCartContext,
        fetchCartFromBackend,
        mergeGuestCartWithUser,
        getCartItemsCount,
        getCartTotal,
      }}
    >
      {children}
    </CartContext.Provider>
  );
};

export const useCart = () => {
  const context = useContext(CartContext);
  if (!context) throw new Error("useCart must be used within a CartProvider");
  return context;
};

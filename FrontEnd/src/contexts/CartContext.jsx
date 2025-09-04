import { createContext, useState, useEffect, useContext } from "react";
import { createSale } from "@/api/saleAction";
import { toast } from "sonner";

export const CartContext = createContext();

export const CartProvider = ({ children }) => {
  const [cart, setCart] = useState(() => {
    return JSON.parse(localStorage.getItem("cart")) || [];
  });

  useEffect(() => {
    localStorage.setItem("cart", JSON.stringify(cart));
  }, [cart]);

  const addToCart = (product, quantity = 1) => {
    setCart((prev) => {
      const existing = prev.find((p) => p.id === product.id);

      if (existing) {
        if (existing.quantity + quantity > product.stock) {
          toast.error("Cannot add more than available stock!");
          return prev;
        }
        return prev.map((p) =>
          p.id === product.id ? { ...p, quantity: p.quantity + quantity } : p
        );
      }

      if (quantity > product.stock) {
        toast.error("Cannot add more than available stock!");
        return prev;
      }

      toast.success(`${product.productName} added to cart!`);
      return [...prev, { ...product, quantity }];
    });
  };

  const removeFromCart = (productId) => {
    setCart((prev) => prev.filter((p) => p.id !== productId));
    // toast.warning("Item removed from cart");
  };

  const clearCart = () => {
    setCart([]);
    // toast.warning("Cart cleared");
  };

  const increaseQty = (productId) =>
    setCart((prev) =>
      prev.map((p) => {
        if (p.id === productId) {
          if (p.quantity + 1 > p.stock) {
            toast.error("Reached maximum stock!");
            return p;
          }
          return { ...p, quantity: p.quantity + 1 };
        }
        return p;
      })
    );

  const decreaseQty = (productId) =>
    setCart((prev) =>
      prev.map((p) => {
        if (p.id === productId) {
          if (p.quantity <= 1) {
            toast.warning("Quantity cannot be less than 1");
            return p;
          }
          return { ...p, quantity: p.quantity - 1 };
        }
        return p;
      })
    );

  const checkoutCart = async () => {
    try {
      const items = cart.map((p) => ({
        product_id: p.id,
        quantity: p.quantity,
      }));
      console.log("Items for check:", items);
      const sale = await createSale({ items });
      // toast.success("Checkout successful!");
      return sale;
    } catch (error) {
      console.error("Checkout error:", error);
      toast.error("Checkout failed");
      throw error;
    }
  };

  return (
    <CartContext.Provider
      value={{
        cart,
        addToCart,
        removeFromCart,
        clearCart,
        increaseQty,
        decreaseQty,
        checkoutCart,
      }}
    >
      {children}
    </CartContext.Provider>
  );
};

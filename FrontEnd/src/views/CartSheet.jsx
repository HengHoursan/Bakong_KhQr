import { useState, useContext } from "react";
import { ShoppingCart, Plus, Minus, Trash2 } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetFooter,
} from "@/components/ui/sheet";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { CartContext } from "../contexts/CartContext";
import QRPaymentCard from "./QRPaymentCard";
import Loader from "../components/Loader";
import { toast } from "sonner";

const CartSheet = () => {
  const {
    cart,
    removeFromCart,
    clearCart,
    increaseQty,
    decreaseQty,
    checkoutCart,
  } = useContext(CartContext);
  const [isOpen, setIsOpen] = useState(false);
  const [saleResult, setSaleResult] = useState(null);
  const [isLoading, setIsLoading] = useState(false);

  // Calculate cart total
  const cartTotal = cart.reduce(
    (sum, item) => sum + item.price * item.quantity,
    0
  );

  const handleCheckout = async () => {
    try {
      setIsLoading(true);
      const response = await checkoutCart();
      setIsOpen(false);
      await new Promise((resolve) => setTimeout(resolve, 2000)); 
      setSaleResult({ payment: response.sale.payment });
    } catch (error) {
      console.error("Checkout error:", error);
      toast.error("Checkout failed!");
    } finally {
      setIsLoading(false);
    }
  };

  const handleRegenerate = async () => {
    try {
      if (!saleResult) return;
      const newSale = await checkoutCart();
      setSaleResult({ payment: newSale.sale.payment });
    } catch (err) {
      console.error("Failed to regenerate QR:", err);
      toast.error("Failed to regenerate QR!");
    }
  };
  const handlePaymentSuccess = async () => {
    try {
      clearCart();
      // toast.success("Payment successful! ✅");
      await new Promise((resolve) => setTimeout(resolve, 1000));
    } catch (err) {
      console.error("Error during payment success handling:", err);
      // toast.error("Something went wrong while clearing the cart.");
    } finally {
      setSaleResult(null);
    }
  };

  return (
    <>
      {/* Overlay Loader */}
      {isLoading && (
        <div className="fixed inset-0 bg-black/10 backdrop-blur-sm flex items-center justify-center z-50">
          <Loader />
        </div>
      )}

      {/* Cart Icon */}
      <div className="relative">
        <ShoppingCart
          className="w-6 h-6 cursor-pointer"
          onClick={() => setIsOpen(true)}
        />
        {cart.length > 0 && (
          <Badge
            variant="destructive"
            className="absolute -top-2 -right-2 rounded-full w-5 h-5 flex items-center justify-center text-xs"
          >
            {cart.reduce((sum, p) => sum + p.quantity, 0)}
          </Badge>
        )}
      </div>

      {/* Cart Sheet */}
      <Sheet open={isOpen} onOpenChange={setIsOpen}>
        <SheetContent side="right" className="w-[500px] flex">
          <SheetHeader>
            <SheetTitle>My Cart ({cart.length} items)</SheetTitle>
          </SheetHeader>

          <div className="flex-1 overflow-y-auto mt-4 space-y-2">
            {cart.length === 0 ? (
              <p className="text-center text-gray-500">Cart is empty</p>
            ) : (
              cart.map((item) => (
                <Card key={item.id} className="flex items-center gap-2 p-2">
                  {item.image ? (
                    <img
                      src={item.image}
                      alt={item.productName}
                      className="w-16 h-16 object-cover rounded"
                    />
                  ) : (
                    <div className="w-16 h-16 flex items-center justify-center bg-gray-100 text-gray-400 rounded">
                      No Image
                    </div>
                  )}
                  <CardContent className="flex-1 flex flex-col justify-center gap-1">
                    <h3 className="font-semibold">{item.productName}</h3>
                    <p className="text-sm text-gray-600">
                      {item.category?.name || "Uncategorized"}
                    </p>
                    <p className="font-bold">
                      {item.price}{" "}
                      <span style={{ fontFamily: "Hanuman, sans-serif" }}>
                        ៛
                      </span>
                    </p>
                  </CardContent>
                  <div className="flex flex-col items-center gap-1">
                    <div className="flex items-center border rounded overflow-hidden">
                      <button
                        className="px-2 py-1 hover:bg-gray-100"
                        onClick={() => decreaseQty(item.id)}
                      >
                        <Minus className="w-3 h-3" />
                      </button>
                      <span className="px-3 py-1">{item.quantity}</span>
                      <button
                        className="px-2 py-1 hover:bg-gray-100"
                        onClick={() => increaseQty(item.id)}
                      >
                        <Plus className="w-3 h-3" />
                      </button>
                    </div>
                    <Button
                      variant="destructive"
                      size="sm"
                      onClick={() => removeFromCart(item.id)}
                      className="w-full mt-1"
                    >
                      <Trash2 className="w-3 h-3 mr-1" /> Remove
                    </Button>
                  </div>
                </Card>
              ))
            )}
          </div>

          {/* Total Price */}
          {cart.length > 0 && (
            <div className="mt-4 px-2 py-2 border-t flex justify-between items-center font-bold text-lg">
              <span>Total Price:</span>
              <span>
                {cartTotal}{" "}
                <span style={{ fontFamily: "Hanuman, sans-serif" }}>៛</span>
              </span>
            </div>
          )}

          {/* Footer Buttons */}
          {cart.length > 0 && (
            <SheetFooter className="mt-4 flex flex-col gap-2">
              <Button onClick={handleCheckout} disabled={isLoading}>
                Checkout
              </Button>
              <Button onClick={() => clearCart()} variant="secondary">
                Clear Cart
              </Button>
            </SheetFooter>
          )}
        </SheetContent>
      </Sheet>

      {/* QR Payment Modal */}
      {saleResult?.payment && (
        <div className="fixed inset-0 flex items-center justify-center bg-black/40 z-50 p-4">
          <QRPaymentCard
            payment={saleResult.payment}
            onClose={() => setSaleResult(null)}
            onRegenerate={handleRegenerate}
            onPaid={handlePaymentSuccess}
          />
        </div>
      )}
    </>
  );
};

export default CartSheet;

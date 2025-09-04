import { useState, useEffect } from "react";
import QRCode from "react-qr-code";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardFooter } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { checkSalePayment } from "@/api/saleAction";
import { toast } from "sonner";

const QRPaymentCard = ({ payment, onClose, onRegenerate, onPaid }) => {
  const [remainingTime, setRemainingTime] = useState(
    payment.expiration - Date.now()
  );
  const [isPaid, setIsPaid] = useState(payment.paid);
  const [hasExpiredToast, setHasExpiredToast] = useState(false);

  // Countdown timer for QR expiration
  useEffect(() => {
    const countdown = setInterval(() => {
      const time = payment.expiration - Date.now();
      setRemainingTime(time > 0 ? time : 0);
    }, 1000);

    return () => clearInterval(countdown);
  }, [payment]);

  // Check the server every 5 seconds to see if this payment has been completed
  useEffect(() => {
    if (!payment.md5 || isPaid) return;

    const pollPayment = setInterval(async () => {
      try {
        const result = await checkSalePayment(payment.md5);
        if (result.sale?.payment?.paid) {
          setIsPaid(true);
          toast.success("Payment successful! ✅");
          if (onPaid) onPaid();
          clearInterval(pollPayment);
        }
      } catch (err) {
        console.error("Error checking payment:", err);
      }
    }, 5000);

    return () => clearInterval(pollPayment);
  }, [payment, isPaid, onPaid]);

  // Trigger onPaid immediately if already paid
  useEffect(() => {
    if (payment.paid) {
      setIsPaid(true);
      if (onPaid) onPaid();
    }
  }, [payment.paid, onPaid]);

  // Show toast when QR expires
  useEffect(() => {
    if (!isPaid && remainingTime <= 0 && !hasExpiredToast) {
      toast("Payment Expired ⏰");
      setHasExpiredToast(true);
    }
  }, [remainingTime, isPaid, hasExpiredToast]);

  const formatTime = (ms) => {
    const seconds = Math.floor(ms / 1000);
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;
    return `${minutes.toString().padStart(2, "0")}:${remainingSeconds
      .toString()
      .padStart(2, "0")}`;
  };

  const expired = !isPaid && remainingTime <= 0;
  const showQR = !isPaid && !expired;

  return (
    <div className="flex items-center justify-center min-h-screen p-4">
      <Card className="w-80 text-center shadow-lg">
        <CardContent className="flex flex-col items-center gap-4">
          <div>
            <p className="text-gray-500 text-sm">Amount</p>
            <p className="text-2xl font-bold mt-[20px]">
              {payment.amount.toLocaleString()} {payment.currency}
            </p>
          </div>

          {showQR && (
            <div className="bg-white p-4 rounded-lg shadow-md">
              <QRCode
                value={payment.qr}
                size={180}
                level="H"
                includeMargin={true}
                bgColor="#F3F4F6"
              />
            </div>
          )}

          {showQR && (
            <Badge variant="destructive" className="mt-2">
              Expires in: {formatTime(remainingTime)}
            </Badge>
          )}

          {expired && (
            <>
              <Badge variant="outline" className="mt-2">
                Payment expired ⏰
              </Badge>
              <Button onClick={onRegenerate} className="mt-2 w-full">
                Regenerate QR
              </Button>
            </>
          )}

          {isPaid && (
            <Badge variant="success" className="mt-2">
              Payment Completed ✅
            </Badge>
          )}
        </CardContent>
        <CardFooter>
          <Button variant="ghost" onClick={onClose} className="w-full">
            Close
          </Button>
        </CardFooter>
      </Card>
    </div>
  );
};

export default QRPaymentCard;

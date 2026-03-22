import { useState } from 'react';
import { paymentService, RazorpayLinkResponse } from '@/services/paymentService';

declare global {
  interface Window {
    Razorpay: any;
  }
}

interface RazorpayPaymentProps {
  amount: number;
  orderId: number;
  onSuccess: (paymentId: string) => void;
  onFailure: (error: any) => void;
  onClose: () => void;
}

export const RazorpayPayment: React.FC<RazorpayPaymentProps> = ({
  amount,
  orderId,
  onSuccess,
  onFailure,
  onClose
}) => {
  const [isLoading, setIsLoading] = useState(false);

  const handlePayment = async () => {
    setIsLoading(true);
    
    try {
      // Create payment order on backend
      const paymentOrder = await paymentService.createPaymentOrder({
        amount,
        orderId
      });

      // Create Razorpay payment link
      const paymentLink: RazorpayLinkResponse = await paymentService.createRazorpayPaymentLink({
        amount,
        orderId
      });

      // Initialize Razorpay
      const options = {
        key: 'rzp_test_RvkRUEHFCxl4Rz', // Your Razorpay test key
        amount: amount * 100, // Convert to paise
        currency: 'INR',
        name: 'SastaBazaar',
        description: `Payment for Order #${orderId}`,
        order_id: paymentOrder.id,
        handler: async (response: any) => {
          try {
            // Process payment on backend
            const success = await paymentService.processPayment({
              paymentOrderId: paymentOrder.id,
              paymentId: response.razorpay_payment_id,
              paymentLinkId: paymentLink.id
            });

            if (success) {
              onSuccess(response.razorpay_payment_id);
            } else {
              onFailure(new Error('Payment processing failed'));
            }
          } catch (error) {
            onFailure(error);
          }
        },
        prefill: {
          name: 'Customer Name', // Get from user context
          email: 'customer@example.com', // Get from user context
          contact: '9999999999' // Get from user context
        },
        notes: {
          address: 'Customer Address',
          orderId: orderId.toString()
        },
        theme: {
          color: '#3399cc'
        },
        modal: {
          ondismiss: () => {
            onClose();
          },
          escape: true,
          backdropclose: true
        }
      };

      const razorpay = new window.Razorpay(options);
      razorpay.open();

    } catch (error) {
      console.error('Payment error:', error);
      onFailure(error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <button
      onClick={handlePayment}
      disabled={isLoading}
      className="w-full flex items-center justify-center gap-2 px-6 py-3 rounded-lg bg-primary text-primary-foreground font-semibold hover:bg-primary/90 transition-colors disabled:opacity-50"
    >
      {isLoading ? (
        <>
          <div className="w-4 h-4 border-2 border-primary-foreground border-t-transparent rounded-full animate-spin" />
          Processing...
        </>
      ) : (
        <>
          Pay with Razorpay
        </>
      )}
    </button>
  );
};

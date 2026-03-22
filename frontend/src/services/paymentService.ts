import axios from "../lib/axios";

export interface PaymentOrderRequest {
  amount: number;
  orderId: number;
}

export interface PaymentOrderResponse {
  id: string;
  amount: number;
  currency: string;
  status: string;
  createdAt: string;
}

export interface RazorpayLinkRequest {
  amount: number;
  orderId: number;
}

export interface RazorpayLinkResponse {
  id: string;
  short_url: string;
  amount: number;
  currency: string;
  description: string;
}

export interface PaymentProcessRequest {
  paymentOrderId: string;
  paymentId: string;
  paymentLinkId: string;
}

export const paymentService = {
  // Create a payment order for checkout
  createPaymentOrder: async (payload: PaymentOrderRequest) => {
    const res = await axios.post("/api/payments/create", { 
      ...payload,
      orders: [] // Pass empty array to avoid null pointer
    });
    return res.data;
  },

  // Get payment order by ID
  getPaymentOrderById: async (orderId: string) => {
    const res = await axios.get(`/api/payments/${orderId}`);
    return res.data;
  },

  // Get payment order by payment ID
  getPaymentOrderByPaymentId: async (paymentId: string) => {
    const res = await axios.get(`/api/payments/payment/${paymentId}`);
    return res.data;
  },

  // Process a successful payment
  processPayment: async (payload: PaymentProcessRequest) => {
    const res = await axios.post("/api/payments/process", payload);
    return res.data;
  },

  // Create Razorpay payment link
  createRazorpayPaymentLink: async (payload: RazorpayLinkRequest) => {
    const res = await axios.post("/api/payments/razorpay/link", payload);
    return res.data;
  },

  // Create Stripe payment link (placeholder)
  createStripePaymentLink: async (payload: RazorpayLinkRequest) => {
    const res = await axios.post("/api/payments/stripe/link", payload);
    return res.data;
  },

  // Get payment status
  getPaymentStatus: async (paymentId: string) => {
    const res = await axios.get(`/api/payments/status/${paymentId}`);
    return res.data;
  },

  // Cancel payment
  cancelPayment: async (paymentId: string) => {
    const res = await axios.post(`/api/payments/cancel/${paymentId}`);
    return res.data;
  }
};

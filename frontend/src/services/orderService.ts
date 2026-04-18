import axios from "../lib/axios";

export const orderService = {
  // Sync cart with backend before creating order
  syncCart: async (cartItems: any[]) => {
    const res = await axios.post("/api/orders/sync-cart", cartItems);
    return res.data;
  },

  // Create a new order
  createOrder: async (address: any) => {
    const res = await axios.post("/api/orders", address);
    return res.data;
  },

  // Get order by ID
  getOrderById: async (orderId: number) => {
    const res = await axios.get(`/api/orders/${orderId}`);
    return res.data;
  },

  // Get user's order history
  getUserOrderHistory: async () => {
    const res = await axios.get("/api/orders/user");
    return res.data;
  },

  // Seller: Get orders for their products
  getSellerOrders: async () => {
    const res = await axios.get("/api/orders/seller");
    return res.data;
  },

  // Seller: Update order status
  updateOrderStatus: async (orderId: number, orderStatus: string) => {
    const res = await axios.put(`/api/orders/${orderId}/status`, orderStatus, {
      headers: { 'Content-Type': 'application/json' }
    });
    return res.data;
  },

  // Cancel an order
  cancelOrder: async (orderId: number) => {
    const res = await axios.put(`/api/orders/${orderId}/cancel`);
    return res.data;
  },

  // Admin: Get all orders
  getAllOrders: async () => {
    const res = await axios.get("/api/orders/admin/all");
    return res.data;
  }
};

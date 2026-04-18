import axios from "../lib/axios";

export const cartService = {
  // Get the current user's cart
  getUserCart: async () => {
    const res = await axios.get("/api/cart");
    return res.data;
  },

  // Add an item to the cart
  addItemToCart: async (productId: number, size: string, quantity: number) => {
    const res = await axios.put("/api/cart/add", { productId, size, quantity });
    return res.data;
  },

  // Update a cart item's details (e.g., quantity)
  updateCartItem: async (cartItemId: number, cartItemData: any) => {
    const res = await axios.put(`/api/cart/item/${cartItemId}`, cartItemData);
    return res.data;
  },

  // Remove an item from the cart
  deleteCartItem: async (cartItemId: number) => {
    const res = await axios.delete(`/api/cart/item/${cartItemId}`);
    return res.data;
  }
};

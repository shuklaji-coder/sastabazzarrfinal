import axios from "../lib/axios";

export const productService = {
  // GET Product By ID
  getProductById: async (productId: number) => {
    const res = await axios.get(`/products/${productId}`);
    return res.data;
  },

  // SEARCH Product
  searchProduct: async (query?: string) => {
    const res = await axios.get('/products/search', { params: { query } });
    return res.data;
  },

  // GET ALL Products (with optional filters)
  getAllProducts: async (filters: any = {}) => {
    const res = await axios.get('/products', { params: filters });
    return res.data;
  },

  // CREATE Product (Admin/Seller)
  createProduct: async (productData: any) => {
    const res = await axios.post("/sellers/products", productData);
    return res.data;
  },

  // UPDATE Product (Admin/Seller)
  updateProduct: async (productId: number, productData: any) => {
    const res = await axios.put(`/sellers/products/${productId}`, productData);
    return res.data;
  },

  // DELETE Product (Admin/Seller)
  deleteProduct: async (productId: number) => {
    const res = await axios.delete(`/sellers/products/${productId}`);
    return res.data;
  }
};

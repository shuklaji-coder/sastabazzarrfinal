import axios from "../lib/axios";

export const reviewService = {
  // Get reviews for a product
  getProductReviews: async (productId: number | string) => {
    const res = await axios.get(`/api/products/${productId}/reveivs`);
    return res.data;
  },

  // Create a new review
  createReview: async (productId: number | string, reviewData: { revievText: string, revievRating: number, productImages?: string[] }) => {
    const res = await axios.post(`/api/products/${productId}/reviews`, {
      revievText: reviewData.revievText,
      revievRating: reviewData.revievRating,
      Productimages: reviewData.productImages || []
    });
    return res.data;
  },

  // Update a review
  updateReview: async (reviewId: number | string, reviewData: { revievText: string, revievRating: number }) => {
    const res = await axios.patch(`/api/reviews/${reviewId}`, reviewData);
    return res.data;
  },

  // Delete a review
  deleteReview: async (reviewId: number | string) => {
    const res = await axios.delete(`/api/reviews/${reviewId}`);
    return res.data;
  }
};

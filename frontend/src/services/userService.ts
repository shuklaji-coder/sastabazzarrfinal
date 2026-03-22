import axios from "../lib/axios";

export const userService = {
  getUserProfile: async () => {
    const res = await axios.get("/user/profile");
    return res.data;
  },

  getUserAddresses: async () => {
    const res = await axios.get("/api/addresses");
    return res.data;
  },

  addAddress: async (address: any) => {
    const res = await axios.post("/api/addresses", address);
    return res.data;
  },

  deleteAddress: async (addressId: number) => {
    const res = await axios.delete(`/api/addresses/${addressId}`);
    return res.data;
  }
};

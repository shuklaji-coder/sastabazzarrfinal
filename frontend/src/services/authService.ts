import axios from "../lib/axios";

export interface LoginRequest {
  email: string;
  otp: string;
}

export interface LoginOtpRequest {
  email: string;
  role: string;
}

export interface SignupRequest {
  email: string;
  fullName: string;
  mobile: string;
  password?: string;
  otp: string;
}

export const authService = {
  // Request OTP for login or signup
  sendLoginOtp: async (req: LoginOtpRequest) => {
    const res = await axios.post("/auth/sent/login-signup-otp", req);
    return res.data;
  },

  // Complete Signup
  signup: async (req: SignupRequest) => {
    const res = await axios.post("/auth/signup", req);
    return res.data;
  },

  // Login using OTP and receive JWT token
  login: async (req: LoginRequest) => {
    const response = await axios.post("/auth/signing", req);
    if (response.data && response.data.jwt) {
      localStorage.setItem("jwt_token", response.data.jwt);
      localStorage.setItem("user_role", response.data.role);
    }
    return response.data;
  },

  // Logout method (client-side clears local storage)
  logout: () => {
    localStorage.removeItem("jwt_token");
    localStorage.removeItem("user_role");
  },

  isAuthenticated: () => {
    return !!localStorage.getItem("jwt_token");
  }
};

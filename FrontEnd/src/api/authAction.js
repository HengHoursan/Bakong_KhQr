import axiosInstance from "@/helpers/axiosInstance";

// Register a new user
export const registerUser = async (userData) => {
  try {
    const { data } = await axiosInstance.post("/api/auth/register", userData);
    return data;
  } catch (error) {
    console.error("Error registering user:", error.message);
    throw error;
  }
};

// Login user
export const loginUser = async (credentials) => {
  try {
    const { data } = await axiosInstance.post("/api/auth/login", credentials);
    return data;
  } catch (error) {
    console.error("Error logging in user:", error.message);
    throw error;
  }
};

// Logout user
export const logoutUser = async () => {
  try {
    const { data } = await axiosInstance.post("/api/auth/logout");
    return data;
  } catch (error) {
    console.error("Error logging out user:", error.message);
    throw error;
  }
};

// Get current logged-in user
export const getCurrentUser = async () => {
  try {
    const { data } = await axiosInstance.get("/api/auth/me");
    return data;
  } catch (error) {
    console.error("Error fetching current user:", error.message);
    throw error;
  }
};

// Refresh access token
export const refreshToken = async () => {
  try {
    const { data } = await axiosInstance.get("/api/auth/refresh-token");
    return data;
  } catch (error) {
    console.error("Error refreshing access token:", error.message);
    throw error;
  }
};

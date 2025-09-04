import axiosInstance from "@/helpers/axiosInstance";
import { productFormData } from "@/helpers/formData";

// Get all products
export const getAllProducts = async () => {
  try {
    const { data } = await axiosInstance.get("/api/products");
    if (data.length === 0) console.warn("No products found");
    return data;
  } catch (error) {
    console.error("Error fetching products:", error.message);
    throw error;
  }
};

// Get product by ID
export const getProductById = async (id) => {
  try {
    const { data } = await axiosInstance.get(`/api/products/${id}`);
    return data;
  } catch (error) {
    console.error("Error fetching product by ID:", error.message);
    throw error;
  }
};

// Create product
export const createNewProduct = async (productData) => {
  try {
    const formData = productFormData(productData);
    const { data } = await axiosInstance.post("/api/products", formData, {
      headers: { "Content-Type": "multipart/form-data" },
    });
    return data;
  } catch (error) {
    console.error("Error creating product:", error.message);
    throw error;
  }
};

// Update product
export const updateProduct = async (id, updatedData) => {
  try {
    const formData = productFormData(updatedData);
    const { data } = await axiosInstance.put(`/api/products/${id}`, formData, {
      headers: { "Content-Type": "multipart/form-data" },
    });
    return data;
  } catch (error) {
    console.error("Error updating product:", error.message);
    throw error;
  }
};

// Delete product
export const deleteProduct = async (id) => {
  try {
    const { data } = await axiosInstance.delete(`/api/products/${id}`);
    return data;
  } catch (error) {
    console.error("Error deleting product:", error.message);
    throw error;
  }
};

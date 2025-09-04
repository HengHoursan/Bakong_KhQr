import axiosInstance from "../helpers/axiosInstance";

//Get all categories
export const getAllProductCategories = async () => {
  try {
    const { data } = await axiosInstance.get("/api/productCategories");
    return data;
  } catch (error) {
    console.error("Error fetching product categories:", error.message);
    throw error;
  }
};

//Get category by ID
export const getProductCategoryById = async (id) => {
  try {
    const { data } = await axiosInstance.get(`/api/productCategories/${id}`);
    return data;
  } catch (error) {
    console.error("Error fetching product category by ID:", error.message);
    throw error;
  }
};

//Create category
export const createNewProductCategory = async (categoryData) => {
  try {
    const { data } = await axiosInstance.post(
      "/api/productCategories",
      categoryData
    );
    return data;
  } catch (error) {
    console.error("Error creating product category:", error.message);
    throw error;
  }
};

//Update category
export const updateProductCategory = async (id, updatedData) => {
  try {
    const { data } = await axiosInstance.put(
      `/api/productCategories/${id}`,
      updatedData
    );
    return data;
  } catch (error) {
    console.error("Error updating product category:", error.message);
    throw error;
  }
};

//Delete category
export const deleteProductCategory = async (id) => {
  try {
    const { data } = await axiosInstance.delete(`/api/productCategories/${id}`);
    return data;
  } catch (error) {
    console.error("Error deleting product category:", error.message);
    throw error;
  }
};

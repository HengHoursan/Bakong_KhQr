import axiosInstance from "../helpers/axiosInstance";

//Create a new sale
export const createSale = async (saleData) => {
  try {
    const { data } = await axiosInstance.post("/api/sales", saleData);
    return data;
  } catch (error) {
    console.error("Error creating sale:", error.message);
    throw error;
  }
};

//Check sale payment
export const checkSalePayment = async (md5) => {
  try {
    const { data } = await axiosInstance.post("/api/sales/check-payment", {
      md5,
    });
    return data;
  } catch (error) {
    console.error("Error checking sale payment:", error.message);
    throw error;
  }
};

//Get all sales
export const getAllSales = async () => {
  try {
    const { data } = await axiosInstance.get("/api/sales");
    return data;
  } catch (error) {
    console.error("Error fetching sales:", error.message);
    throw error;
  }
};

//Get sale by ID
export const getSaleById = async (id) => {
  try {
    const { data } = await axiosInstance.get(`/api/sales/${id}`);
    return data;
  } catch (error) {
    console.error("Error fetching sale by ID:", error.message);
    throw error;
  }
};

export const productFormData = (productData) => {
  const formData = new FormData();

  formData.append("productName", productData.productName);
  formData.append("price", productData.price);
  formData.append("description", productData.description);
  formData.append("category", productData.category);

  if (productData.image && productData.image[0] instanceof File) {
    formData.append("image", productData.image[0]);
  }

  return formData;
};

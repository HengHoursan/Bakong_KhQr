const db = require("../model");
const Product = db.product;
const cloudinary = require("../config/cloudinary");

// GET all products
exports.getAllProducts = async (req, res) => {
  try {
    const products = await Product.find().populate("category", "name");
    if (products.length === 0) {
      return res.status(404).json({ message: "No products found" });
    }
    res.status(200).json(products);
  } catch (error) {
    console.error("Error retrieving products:", error);
    res.status(500).json({ message: "Error retrieving products", error });
  }
};

// GET product by ID
exports.getProductById = async (req, res) => {
  const { id } = req.params;
  try {
    const product = await Product.findById(id).populate("category");
    if (!product) {
      return res.status(404).json({ message: "Product not found" });
    }
    res.status(200).json(product);
  } catch (error) {
    console.error("Error retrieving product:", error);
    res.status(500).json({ message: "Error retrieving product", error });
  }
};

// CREATE product
exports.createProduct = async (req, res) => {
  const { productName, price, description, category } = req.body;
  try {
    // Upload image to Cloudinary
    const result = await cloudinary.uploader.upload(req.file.path);

    // Create new product
    const newProduct = new Product({
      productName,
      price,
      description,
      category,
      image: result.secure_url, // Cloudinary image URL
      cloudinary_id: result.public_id, // Cloudinary public_id
    });

    await newProduct.save();
    res.status(201).json(newProduct);
  } catch (error) {
    console.error("Error creating product:", error);
    res.status(500).json({ message: "Error creating product", error });
  }
};

// UPDATE product
exports.updateProduct = async (req, res) => {
  const { id } = req.params;
  const { productName, price, description, category } = req.body;
  try {
    let product = await Product.findById(id);
    let result;
    if (req.file) {
      if (product.cloudinary_id) {
        await cloudinary.uploader.destroy(product.cloudinary_id); // Delete old image from Cloudinary
      }
      result = await cloudinary.uploader.upload(req.file.path);
    }
    const data = {
      productName: productName || product.productName,
      price: price || product.price,
      description: description || product.description,
      category: category || product.category,
      image: result?.secure_url || product.image,
      cloudinary_id: result?.public_id || product.cloudinary_id,
    };
    product = await Product.findByIdAndUpdate(id, data, { new: true });
    res.status(200).json(product);
  } catch (error) {
    console.error("Error updating product:", error);
    res.status(500).json({ message: "Error updating product", error });
  }
};

// DELETE product
exports.deleteProduct = async (req, res) => {
  const { id } = req.params;
  try {
    const product = await Product.findById(id);
    if (!product) {
      return res.status(404).json({ message: "Product not found" });
    }
    if (product.cloudinary_id) {
      await cloudinary.uploader.destroy(product.cloudinary_id);
    }
    await Product.findByIdAndDelete(id);
    res.status(200).json({ message: "Product deleted successfully" });
  } catch (error) {
    console.error("Error deleting product:", error);
    res.status(500).json({ message: "Error deleting product", error });
  }
};

const mongoose = require("mongoose");

const productSchema = new mongoose.Schema(
  {
    productName: {
      type: String,
      required: true,
      trim: true,
    },
    price: {
      type: Number,
      required: true,
      min: 0,
    },
    description: {
      type: String,
      trim: true,
    },
    image: {
      type: String,
      trim: true,
      required: true,
    },
    cloudinary_id: {
      type: String,
      trim: true,
    },
    category: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "ProductCategory",
      required: true,
    },
    stock: {
      type: Number,
      default: 0,
    },
  },
  {
    timestamps: true,
  }
);
productSchema.methods.toJSON = function () {
  const { __v, _id, ...Object } = this.toObject();
  Object.id = _id;
  return Object;
};
module.exports = mongoose.model("Product", productSchema);

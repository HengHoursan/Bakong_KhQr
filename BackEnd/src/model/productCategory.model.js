const mongoose = require("mongoose");

const productCategorySchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true,
    },
    description: {
      type: String,
      trim: true,
    },
  },
  {
    timestamps: true,
  }
);
productCategorySchema.methods.toJSON = function () {
  const { __v, _id, ...Object } = this.toObject();
  Object.id = _id;
  return Object;
};
module.exports = mongoose.model("ProductCategory", productCategorySchema);
const mongoose = require("mongoose");

const saleSchema = new mongoose.Schema(
  {
    items: [
      {
        product_id: {
          type: mongoose.Schema.Types.ObjectId,
          ref: "Product",
          required: true,
        },
        productName: { type: String, required: true },
        price: { type: Number, required: true },
        quantity: { type: Number, required: true, min: 1 },
        total: { type: Number, required: true }, // price * quantity
      },
    ],
    totalPrice: { type: Number, required: true, min: 0 },
    soldBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    status: {
      type: String,
      enum: ["PENDING", "PAID", "CANCELLED"],
      default: "PENDING",
    },

    payment: {
      amount: { type: Number, required: true },
      method: { type: String, enum: ["KHQR", "USD"], default: "KHQR" },
      currency: { type: String, enum: ["KHR", "USD"], default: "KHR" },
      qr: { type: String },
      md5: { type: String },
      expiration: { type: Number },
      bakongHash: { type: String },
      fromAccountId: { type: String },
      toAccountId: { type: String },
      transactionId: { type: String },
      externalRef: { type: String },
      paid: { type: Boolean, default: false },
      paidAt: { type: Date },
      deepLink: { type: String },
      deepLinkWeb: { type: String },
    },
    saleDate: { type: Date, default: Date.now },
  },
  { timestamps: true }
);

saleSchema.methods.toJSON = function () {
  const { __v, _id, ...object } = this.toObject();
  object.id = _id;
  return object;
};

module.exports = mongoose.model("Sale", saleSchema);

const mongoose = require("mongoose");

const userSchema = new mongoose.Schema(
  {
    username: {
      type: String,
      required: true,
      unique: true,
      trim: true,
    },
    email: {
      type: String,
      required: true,
      unique: true,
      trim: true,
    },
    password: {
      type: String,
      required: true,
    },
    role: {
      type: String,
      required: true,
      enum: ["Admin", "Editor", "Viewer"],
      default: "Viewer",
    },
  },
  {
    timestamps: true,
  }
);
userSchema.methods.toJSON = function () {
  const { __v, _id, ...Object } = this.toObject();
  Object.id = _id;
  return Object;
};
module.exports = mongoose.model("User", userSchema);
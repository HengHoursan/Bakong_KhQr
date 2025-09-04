const multer = require("multer");
const cloudinary = require("../config/cloudinary");
const { CloudinaryStorage } = require("multer-storage-cloudinary");
const path = require("path");

const storage = new CloudinaryStorage({
  cloudinary,
  params: {
    folder: "products",
    allowed_formats: ["jpg", "jpeg", "png"],
    public_id: (req, file) => {
      const ext = path.extname(file.originalname);
      const name = path.parse(file.originalname).name;
      return `${name}-${Date.now()}${ext}`;
    },
  },
});
const upload = multer({ storage, limits: { fileSize: 5 * 1024 * 1024 } }); // 5 MB limit

module.exports = upload;

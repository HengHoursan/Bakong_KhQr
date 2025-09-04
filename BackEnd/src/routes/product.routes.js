const express = require("express");
const router = express.Router();
const productController = require("../controller/product.controller");
const authenticationMiddleware = require("../middleware/authentication");
const authorizeRoles = require("../middleware/authorizeRoles");
const upload = require("../middleware/multerCloudinary"); // updated Cloudinary Multer

// Public: get all or one product
router.get("/", productController.getAllProducts);
router.get("/:id", productController.getProductById);

// Protected: create/update (Admin, Editor), upload image directly to Cloudinary
router.post(
  "/",
  authenticationMiddleware,
  authorizeRoles("Admin", "Editor"),
  upload.single("image"), // handles upload directly to Cloudinary
  productController.createProduct
);

router.put(
  "/:id",
  authenticationMiddleware,
  authorizeRoles("Admin", "Editor"),
  upload.single("image"), // optional new image
  productController.updateProduct
);

// Protected: delete (Admin only)
router.delete(
  "/:id",
  authenticationMiddleware,
  authorizeRoles("Admin"),
  productController.deleteProduct
);

module.exports = router;

const express = require("express");
const router = express.Router();
const categoryController = require("../controller/productCategory.controller");
const authenticationMiddleware = require("../middleware/authentication");
const authorizeRolesMiddleware = require("../middleware/authorizeRoles");

// Public: get all or one product category
router.get("/",categoryController.getAllCategories);
router.get("/:id", categoryController.getCategoryById);

// Protected: create/update (Admin, Editor)
router.post(
  "/",
  authenticationMiddleware,
  authorizeRolesMiddleware("Admin", "Editor"),
  categoryController.createCategory
);

router.put(
  "/:id",
  authenticationMiddleware,
  authorizeRolesMiddleware("Admin", "Editor"),
  categoryController.updateCategory
);

// Protected: delete (Admin only)
router.delete(
  "/:id",
  authenticationMiddleware,
  authorizeRolesMiddleware("Admin"),
  categoryController.deleteCategory
);

module.exports = router;

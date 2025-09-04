const express = require("express");
const router = express.Router();
const saleController = require("../controller/sale.controller");
const authenticationMiddleware = require("../middleware/authentication");

// Create a new sale
router.post("/", authenticationMiddleware, saleController.createSale);

// Check payment (simulate or real later)
router.post(
  "/check-payment",
  authenticationMiddleware,
  saleController.checkSalePayment
);

// Get all sales
router.get("/", authenticationMiddleware, saleController.getAllSales);

// Get sale by ID
router.get("/:id", authenticationMiddleware, saleController.getSaleById);

module.exports = router;

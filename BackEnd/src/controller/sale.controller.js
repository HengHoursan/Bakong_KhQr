const db = require("../model");
const Sale = db.sale;
const Product = db.product;

const { BakongKHQR, khqrData, IndividualInfo } = require("bakong-khqr");
const BAKONG_BASE_URL = process.env.BAKONG_PROD_BASE_API_URL;
const BAKONG_ACCESS_TOKEN = process.env.BAKONG_ACCESS_TOKEN;

// Create sale
exports.createSale = async (req, res) => {
  const { items } = req.body; // items = [{ product_id, quantity }]
  const soldBy = req.user.id;
  try {
    if (!items || items.length === 0) {
      return res
        .status(400)
        .json({ success: false, message: "No items provided" });
    }

    const populatedItems = [];
    for (const item of items) {
      const product = await Product.findById(item.product_id);
      if (!product) {
        return res.status(404).json({
          success: false,
          message: `Product not found: ${item.product_id}`,
        });
      }
      if (product.stock < item.quantity) {
        return res.status(400).json({
          success: false,
          message: `Insufficient stock for product: ${product.productName}`,
        });
      }

      populatedItems.push({
        product_id: product.id,
        productName: product.productName,
        price: product.price,
        quantity: item.quantity,
        total: product.price * item.quantity,
      });
    }

    // calculate total price
    const totalPrice = populatedItems.reduce(
      (sum, item) => sum + item.price * item.quantity,
      0
    );

    // generate KHQR (expires in 5 mins)
    const expirationTimestamp = Date.now() + 5 * 60 * 1000;
    const optionalData = {
      currency: khqrData.currency.khr,
      amount: totalPrice,
      expirationTimestamp,
    };

    const individualInfo = new IndividualInfo(
      process.env.BAKONG_ACCOUNT_USERNAME,
      "Heng Hoursan",
      "BATTAMBANG",
      optionalData
    );
    console.log("Populated Items:", populatedItems);
    console.log("Total Price:", totalPrice);
    const khqr = new BakongKHQR();
    const qrData = khqr.generateIndividual(individualInfo);
    console.log("Generated KHQR:", qrData);
    if (!qrData.data || qrData.status?.code !== 0) {
      return res.status(400).json({
        success: false,
        message: qrData.status?.message || "Failed to generate KHQR",
        error: qrData.status || null,
      });
    }
    // build deep links
    const deepLink = `bakong://khqr?qr=${encodeURIComponent(qrData.data.qr)}`;
    const deepLinkWeb = `https://www.bakong.com.kh/khqr?qr=${encodeURIComponent(
      qrData.data.qr
    )}`;

    // save sale
    const newSale = new Sale({
      items: populatedItems,
      totalPrice,
      soldBy,
      status: "PENDING",
      payment: {
        method: "KHQR",
        currency: "KHR",
        qr: qrData.data.qr,
        md5: qrData.data.md5,
        expiration: expirationTimestamp,
        amount: totalPrice,
        paid: false,
        deepLink,
        deepLinkWeb,
      },
    });

    await newSale.save();
    res.status(201).json({
      success: true,
      message: "Sale created successfully",
      sale: newSale,
    });
  } catch (error) {
    console.error("Error creating sale:", error);
    res
      .status(500)
      .json({ success: false, message: "Error creating sale", error });
  }
};

// Check sale payment
exports.checkSalePayment = async (req, res) => {
  const { md5 } = req.body;

  try {
    if (!md5) {
      return res
        .status(400)
        .json({ success: false, message: "md5 is required" });
    }

    // Find sale by payment.md5
    const sale = await Sale.findOne({ "payment.md5": md5 });
    if (!sale) {
      return res
        .status(404)
        .json({ success: false, message: "Sale not found" });
    }

    // Call Bakong API
    const response = await fetch(
      `${BAKONG_BASE_URL}/check_transaction_by_md5`,
      {
        method: "POST",
        headers: {
          Authorization: `Bearer ${BAKONG_ACCESS_TOKEN}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ md5: sale.payment.md5 }),
      }
    );

    const data = await response.json();

    if (data.responseCode === 0 && data.data?.hash) {
      // Update sale with real transaction details
      sale.status = "PAID";
      sale.payment = {
        ...sale.payment,
        bakongHash: data.data.hash,
        fromAccountId: data.data.fromAccountId,
        toAccountId: data.data.toAccountId,
        transactionId: data.data.transactionId,
        externalRef: data.data.externalRef,
        paid: true,
        paidAt: new Date(),
      };
      await sale.save();

      // Deduct stock
      for (const item of sale.items) {
        await Product.findByIdAndUpdate(item.product_id, {
          $inc: { stock: -item.quantity },
        });
      }

      return res
        .status(200)
        .json({ success: true, message: "Payment confirmed", sale });
    } else {
      return res.status(400).json({
        success: false,
        message: "Payment not completed",
        data: data.data,
      });
    }
  } catch (error) {
    console.error("Error in checkSalePayment:", error.message);
    return res.status(500).json({
      success: false,
      message: "Error checking payment",
      error: error.message,
    });
  }
};

// Get all sales
exports.getAllSales = async (req, res) => {
  try {
    const sales = await Sale.find().populate(
      "items.product_id",
      "productName price"
    );
    if (sales.length === 0) {
      return res
        .status(404)
        .json({ success: false, message: "No sales found" });
    }
    res.status(200).json({ success: true, sales });
  } catch (error) {
    console.error("Error retrieving sales:", error);
    res
      .status(500)
      .json({ success: false, message: "Error retrieving sales", error });
  }
};

// Get sale by ID
exports.getSaleById = async (req, res) => {
  const { id } = req.params;
  try {
    const sale = await Sale.findById(id).populate(
      "items.product_id",
      "productName price"
    );
    if (!sale)
      return res
        .status(404)
        .json({ success: false, message: "Sale not found" });
    res.status(200).json({ success: true, sale });
  } catch (error) {
    console.error("Error retrieving sale:", error);
    res
      .status(500)
      .json({ success: false, message: "Error retrieving sale", error });
  }
};

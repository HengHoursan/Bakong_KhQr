const mongoose = require("mongoose");
require("dotenv").config();

mongoose.Promise = global.Promise;

const db = {};
db.mongoose = mongoose;
db.url = process.env.MONGO_URI;
db.user = require("./user.model");
db.product = require("./product.model");
db.productCategory = require("./productCategory.model");
db.sale = require("./sale.model");

module.exports = db;

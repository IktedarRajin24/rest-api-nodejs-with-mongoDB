
const mongoose = require("mongoose");

const productSchema = new mongoose.Schema({
    name: String,
    price: String,
    seller: String,
    createdAt: {
      type: Date,
      default: Date.now,
    },
  });


const Products = mongoose.model("Products", productSchema);

module.exports = Products;
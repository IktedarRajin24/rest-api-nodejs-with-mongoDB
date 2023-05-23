const mongoose = require("mongoose");

const connectDB = async () => {
  try {
    await mongoose.connect("mongodb://127.0.0.1:27017/test");
    console.log("DB is connected successfully.");
  } catch (error) {
    console.log("DB is not connected.", error);
    process.exit(1);
  }
};

module.exports = connectDB;

const mongoose = require("mongoose");

const userSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  email: {
    type: String,
    required: true,
  },
  password: {
    type: String,
    required: true,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
  employeeType:{
    type: String,
    required: true
  },
  isActive: {
    type: Boolean,
    default: false
  }
});

const Users = mongoose.model("Users", userSchema);

module.exports = Users;

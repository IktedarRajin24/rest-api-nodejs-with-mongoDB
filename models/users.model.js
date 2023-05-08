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
  workingHours: {
    sunday: {
      type: String
    },
    monday: {
      type: String
    },
    tuesday: {
      type: String
    },
    wednesday: {
      type: String
    },
    thursday: {
      type: String
    },
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
  isActive: {
    type: Boolean,
    default: false
  }
});

const Users = mongoose.model("Users", userSchema);

module.exports = Users;

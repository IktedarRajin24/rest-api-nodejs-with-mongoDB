const mongoose = require("mongoose");

const userTiming = new mongoose.Schema({
  userID: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Users",
  },
  date: {
    type: String,
  },
  day: {
    type: String,
  },
  inTime: {
    type: Number,
  },
  outTime: {
    type: Number,
  },
  totalTime: {
    type: Number,
  },
  status: {
    type: String,
  },
});

const TimeTracking = mongoose.model("TimeTracking", userTiming);

module.exports = TimeTracking;

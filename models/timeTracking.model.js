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
    type: String
  },
  outTime: {
    type: String,
  },
  totalTime: {
    type: String,
  },
  status: {
    type: String,
  },
});

const TimeTracking = mongoose.model("TimeTracking", userTiming);

module.exports = TimeTracking;

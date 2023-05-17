const mongoose = require("mongoose");

const holidaySchema = new mongoose.Schema({
  date: {
    type: String,
    required: true,
  },
  day: {
    type: String,
    required: true,
  },
  title: {
    type: String,
    required: true,
  },
});

const Holidays = mongoose.model("Holidays", holidaySchema);

module.exports = Holidays;

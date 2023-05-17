const mongoose = require('mongoose');

const monthNames = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];
const date = new Date();

const durationSchema = new mongoose.Schema({
    userID: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Users",
      },
      starting:{
        type: String,
        default: monthNames[date.getMonth()]
      },
      ending: {
        type: String
      } 
});

const Durations = mongoose.model("durations", durationSchema);

module.exports = Durations;
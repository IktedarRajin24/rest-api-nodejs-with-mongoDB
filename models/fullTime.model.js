const mongoose = require('mongoose');
const Users = require('./users.model');

const fullTimeSchema = new mongoose.Schema({
    userID : {
        type : mongoose.Schema.Types.ObjectId,
        ref: "Users"
    },
    totalWorkingHours: {
        type: Number,
        default: 9
    }
})

const FullTimers = mongoose.model("Fulltimers", fullTimeSchema);

module.exports = FullTimers;
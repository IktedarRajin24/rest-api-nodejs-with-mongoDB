const mongoose = require('mongoose');
const Users = require('./users.model');

const partTimeSchema = new mongoose.Schema({
    userID : {
        type : mongoose.Schema.Types.ObjectId,
        ref: "Users"
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
    }
});

const PartTimers = mongoose.model("PartTimers", partTimeSchema);

module.exports = PartTimers;
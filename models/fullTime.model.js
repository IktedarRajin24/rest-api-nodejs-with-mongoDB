const mongoose = require('mongoose');
const Users = require('./users.model');

const fullTimeSchema = new mongoose.Schema({
    userID : {
        type : mongoose.Schema.Types.ObjectId,
        ref: "Users"
    }
})
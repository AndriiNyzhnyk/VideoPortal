'use strict';

const Mongoose = require('mongoose');
const Schema = Mongoose.Schema;

const pendingUser = new Schema({
    userId:  {
        type: String,
        required: true,
        minlength: 1,
        maxlength: 40
    },
    activateCode: {
        type: String,
        required: true,
        minlength: 1,
        maxlength: 200
    }
});

module.exports = Mongoose.model('PendingUser', pendingUser);
'use strict';

const Mongoose = require('mongoose');
const Schema = Mongoose.Schema;

const forgotPassword = new Schema({
    userId:  {
        type: String,
        required: true,
        minlength: 1,
        maxlength: 40
    },
    verifyCode: {
        type: String,
        required: true,
        minlength: 1,
        maxlength: 200
    },
    createdAt: {
        type: Date,
        default: new Date
    }
});

module.exports = Mongoose.model('ForgotPassword', forgotPassword);
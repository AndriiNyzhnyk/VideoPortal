'use strict';

const ForgotPassword = require('./ForgotPassword');

const self = module.exports = {

    findOne: (filter) => {
        return ForgotPassword.findOne(filter);
    },

    createForgotPasswordEntry: (userId, verifyCode) => {
        return ForgotPassword.create({
            userId,
            verifyCode,
        });
    }
};
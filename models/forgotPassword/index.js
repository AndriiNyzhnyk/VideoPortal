'use strict';

const ForgotPassword = require('./ForgotPassword');

const self = module.exports = {
    /**
     * Find one 'Forgot Password' entry
     * @param {object} filter Filter compatible with MongoDB
     * @returns {Promise<*>}
     */
    findOne: (filter) => {
        return ForgotPassword.findOne(filter);
    },

    /**
     * Create new Forgot Password' entry
     * @param {string} userId User '_id'
     * @param {string} verifyCode Simple random verify code
     * @returns {Promise<*>}
     */
    createForgotPasswordEntry: (userId, verifyCode) => {
        return ForgotPassword.create({
            userId,
            verifyCode,
        });
    }
};
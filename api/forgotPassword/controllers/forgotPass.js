'use strict';

const Boom = require('@hapi/boom');
const { User, ForgotPassword } = require('../../../models');
const Service = require('../services/forgotPass');
const Hashing = require('../../signUp/services/hashing');

const self = module.exports = {
    /**
     * Just render HTML template
     * @returns {Promise<Boom<unknown>|*>}
     */
    getForgotPage: async (req, h) => {
        try {
            return h.view('initForgotPass', {});
        } catch (err) {
            console.error(err);
            return Boom.badImplementation();
        }
    },

    /**
     * Init reset password for user. Send email to user with verify code.
     * @returns {Promise<Boom<unknown>|*>}
     */
    forgotPassword: async (req, h) => {
        try {
            const { email } = req.payload;
            const user = await User.fetchUserByNameOrEmail(email);

            if (!user) {
                return Boom.notFound('This email not found');
            }

            const {result, verifyCode} = await Service.sendEmailToUser(email);
            await ForgotPassword.createForgotPasswordEntry(user._id.toString(), verifyCode);

            return h.response();
        } catch (e) {
            console.log(e);
            return Boom.badImplementation();
        }
    },

    /**
     * Just render HTML template
     * @returns {Promise<Boom<unknown>|*>}
     */
    getResetPasswordPage: async (req, h) => {
        try {
            const { securityParamsFilter } = req.server.methods;

            const verifyCode = await securityParamsFilter(req.params.verifyCode);
            const forgotPasswordEntry = await ForgotPassword.findOne({ verifyCode });

            if (!forgotPasswordEntry) {
                return Boom.badRequest('This link is not valid');
            }

            return h.view('forgotPass', {
                verifyCode
            });
        } catch (e) {
            console.log(e);
            return Boom.badImplementation();
        }
    },

    /**
     * Reset user password
     * @returns {Promise<Boom<unknown>|string>}
     */
    resetPassword: async (req, h) => {
        try {
            const { securityParamsFilter } = req.server.methods;

            const password = await securityParamsFilter(req.payload.password);
            const verifyCode = await securityParamsFilter(req.payload.verifyCode);

            // Find entry into DB
            const forgotPasswordEntry = await ForgotPassword.findOne({ verifyCode });

            if (!forgotPasswordEntry) {
                return Boom.badRequest('This link is not valid');
            }

            const newPassword = await Hashing.hashPassword(password);

            const user = await User.findByIdAndUpdate(forgotPasswordEntry.userId, {
                password: newPassword
            });

            // Check if operations of update password was successful
            if (user) {
                await ForgotPassword.findForgotPasswordEntryByIdAndRemove(forgotPasswordEntry._id);
            }

            return 'The password was successfully updated';
        } catch (err) {
            console.log(err);
            return Boom.badImplementation();
        }
    }
};
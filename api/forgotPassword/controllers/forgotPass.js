'use strict';

const Hoek = require('@hapi/hoek');
const Boom = require('@hapi/boom');
const User = require('../../../models/User');
const ForgotPassword = require('../../../models/ForgotPasswords');
const Service = require('../services/forgotPass');
const Hashing = require('../../signUp/services/hashing');

const self = module.exports = {
    getForgotPage: async (req, h) => {
        return h.view('initForgotPass', {});
    },

    forgotPassord: async (req, h) => {
        try {
            const email = Hoek.escapeHtml(req.payload.email);
            const user = await User.findOne({email});

            if (!user) {
                return Boom.notFound('This email not found');
            }

            const {result, verifyCode} = await Service.sendEmailToUser(email);

            const forgotPasswordEntry = await ForgotPassword.create({
                userId: user._id.toString(),
                verifyCode,
            });

            return 'OK';
        } catch (e) {
            console.log(e);
            h.response('Some Error');
        }
    },

    getResetPasswordPage: async (req, h) => {
        try {
            const verifyCode = Hoek.escapeHtml(req.params.verifyCode);
            const forgotPasswordEntry = await ForgotPassword.findOne({verifyCode});

            if (!forgotPasswordEntry) {
                return Boom.badRequest('This link is not valid');
            }

            return h.view('forgotPass', {
                verifyCode
            });
        } catch (e) {
            console.log(e);
        }
    },

    resetPassword: async (req, h) => {
        try {
            const password = Hoek.escapeHtml(req.payload.password);
            const verifyCode = Hoek.escapeHtml(req.payload.verifyCode);

            // Find entry into DB
            const forgotPasswordEntry = await ForgotPassword.findOne({verifyCode});

            if (!forgotPasswordEntry) {
                return Boom.badRequest('This link is not valid');
            }

            const newPassword = await Hashing.hashPassword(password);

            const user = await User.findByIdAndUpdate(forgotPasswordEntry.userId, {
                password: newPassword
            });

            // Check if operations of update password was successful
            if (!user) {
                await ForgotPassword.findByIdAndRemove(forgotPasswordEntry._id);
            }

            return 'The password was successfully updated';
        } catch (err) {
            console.log(err);
        }
    }
};
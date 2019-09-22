'use strict';

const Hoek = require('@hapi/hoek');
const Boom = require('@hapi/boom');
const User = require('../../../models/User');
const ForgotPassword = require('../../../models/ForgotPasswords');
const Service = require('../services/forgotPass');

const self = module.exports = {
    getForgotPage: async (req, h) => {
        return h.view('initForgotPass', {});
    },

    forgotPassord: async (req, h) => {
        try {
            const email = req.payload.email;
            const user = await User.findOne({email});

            if (!user) {
                return Boom.notFound('This email not found');
            }

            const {result, verifyCode} = await Service.sendEmailToUser(email);

            let forgotPasswordEntry = await ForgotPassword.create({
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
        const code = Hoek.escapeHtml(req.params.verifyCode);

        return h.view('forgotPass', {
            code
        });
    },

    resetPassword: async (req, h) => {
        return 'test';
    }
};
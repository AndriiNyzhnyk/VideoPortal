'use strict';

const Hoek = require('@hapi/hoek');
const User = require('../../../models/User');
const Service = require('../services/forgotPass');

const self = module.exports = {
    getForgotPage: async (req, h) => {
        return h.view('initForgotPass', {});
    },

    forgotPassord: async (req, h) => {
        try {
            const email = req.payload.email;

            const html = await Service.sendEmailToUser(email);


            console.log(html);
            return html;
        } catch (e) {
            console.log(e);
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
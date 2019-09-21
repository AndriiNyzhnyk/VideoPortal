'use strict';

const User = require('../../../models/User');
const Service = require('../services/forgotPass');

const self = module.exports = {
    getForgotPage: async (req, h) => {
        return h.view('initForgotPass', {
            code: 'qwerty1234567890'
        });
    },

    forgotPassord: async (req, h) => {
        return 'test';
    },

    getResetPasswordPage: async (req, h) => {
        return 'test';
    },

    resetPassword: async (req, h) => {
        return 'test';
    }
};
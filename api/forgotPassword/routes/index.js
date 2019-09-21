'use strict';

const controllers = require('../controllers/forgotPass');

const self = module.exports = [
    {
        method: 'GET',
        path: '/forgot-pass',
        handler: controllers.getForgotPage,
        options: { auth: false }
    },
    {
        method: 'POST',
        path: '/forgot-pass',
        handler: controllers.forgotPassord,
        options: { auth: false }
    },
    {
        method: 'GET',
        path: '/reset-password',
        handler: controllers.getResetPasswordPage,
        options: { auth: false }
    },
    {
        method: 'POST',
        path: '/reset-password',
        handler: controllers.resetPassword,
        options: { auth: false }
    }
];
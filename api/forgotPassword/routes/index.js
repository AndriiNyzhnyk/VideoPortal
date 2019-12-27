'use strict';

const Joi = require('@hapi/joi');
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
        handler: controllers.forgotPassword,
        options: {
            auth: false,
            validate: {
                payload:  Joi.object({
                    email: Joi.string().email({ minDomainSegments: 1 }).required(),
                })
            }
        }
    },
    {
        method: 'GET',
        path: '/reset-password/{verifyCode}',
        handler: controllers.getResetPasswordPage,
        options: { auth: false }
    },
    {
        method: 'POST',
        path: '/reset-password',
        handler: controllers.resetPassword,
        options: {
            auth: false,
            validate: {
                payload: Joi.object({
                    password: Joi.string().regex(/^(?=.*?[A-Z])(?=.*?[a-z])(?=.*?[0-9])(?=.*?[#?!@$%^&*-]).{8,}$/).required(),
                    verifyCode: Joi.string().min(10).max(100).required(),
                })
            }
        }
    }
];
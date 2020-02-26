'use strict';

const Joi = require('@hapi/joi');
const controllers = require('../controllers/signIn');

module.exports = [
    {
        method: 'GET',
        path: '/sign-in',
        handler: controllers.signIn,
        options: { auth: false }
    },
    {
        method: 'POST',
        path: '/login',
        handler: controllers.login,
        options: {
            auth: false,
            validate: {
                payload: Joi.object({
                    userName: Joi.string().min(3).max(320).required(),
                    password: Joi.string().regex(/^(?=.*?[A-Z])(?=.*?[a-z])(?=.*?[0-9])(?=.*?[#?!@$%^&*-]).{8,}$/).required(),
                })
            },
            response: {
                status: {
                    200: Joi.object({
                        accessToken: Joi.string().min(1).required(),
                        refreshToken: Joi.string().min(1).required()
                    }),
                },
                failAction: 'error',
            }
        }
    },
    {
        method: 'GET',
        path: '/activate-user-page',
        handler: controllers.getActivateUserPage,
        options: {auth: false}
    }
];
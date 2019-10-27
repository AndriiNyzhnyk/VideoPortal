'use strict';

const Joi = require('@hapi/joi');
const controllers = require('../controllers/admin');

module.exports = [
    {
        method: 'GET',
        path: '/admin',
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
                    userName: Joi.string().min(3).max(20).required(),
                    password: Joi.string().regex(/^(?=.*?[A-Z])(?=.*?[a-z])(?=.*?[0-9])(?=.*?[#?!@$%^&*-]).{8,}$/).required(),
                })
            }
        }
    },
    {
        method: 'GET',
        path: '/activate-user-page',
        handler: controllers.getActivateUserPage,
        options: {auth: false}
    },
];
'use strict';

const Joi = require('@hapi/joi');
const controllers = require('../controllers/admin');

module.exports = [
    {
        method: 'GET',
        path: '/admin',
        handler: controllers.adminControlPanel,
        options: { auth: false }
    },
    {
        method: 'POST',
        path: '/tmp',
        handler: controllers.tmp,
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
];
'use strict';

const Joi = require('@hapi/joi');
const controllers = require('../controllers/signUp');

module.exports = [
    {
        method: 'GET',
        path: '/sign-up',
        handler: controllers.getSignUpPage,
        options: { auth: false }
    },
    {
        method: 'POST',
        path: '/registration',
        handler: controllers.registration,
        options: {
            auth: false,
            validate: {
                payload:  Joi.object({
                    userName: Joi.string().min(3).max(20).required(),
                    email: Joi.string().email({ minDomainSegments: 1 }).required(),
                    password: Joi.string().regex(/^(?=.*?[A-Z])(?=.*?[a-z])(?=.*?[0-9])(?=.*?[#?!@$%^&*-]).{8,}$/).required(),
                })
            }
        }
    },
    {
        method: 'GET',
        path: '/activate-user/{code}',
        handler: controllers.activateUser,
        options: { auth: false }
    },

];
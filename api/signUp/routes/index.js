'use strict';

const Joi = require('@hapi/joi');
const controllers = require('../controllers');

module.exports = [
    {
        method: 'GET',
        path: '/sign-up-form',
        handler: controllers.getSignUpPage
    },
    {
        method: 'POST',
        path: '/registration',
        handler: controllers.registration,
        options: {
            validate: {
                payload: {
                    userName: Joi.string().min(1).max(140).required(),
                    email: Joi.string().email({ minDomainSegments: 1 }).required(),
                    password: Joi.string().regex(/^(?=.*?[A-Z])(?=.*?[a-z])(?=.*?[0-9])(?=.*?[#?!@$%^&*-]).{8,}$/).required(),
                }
            }
        }
    }

];
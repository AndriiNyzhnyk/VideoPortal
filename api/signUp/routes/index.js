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
                    userName: Joi.string().min(1).max(140),
                    email: Joi.string().email(),
                    password: Joi.string().regex(/^[a-zA-Z0-9]{3,30}$/),
                    confirmPassword: Joi.string().regex(/^[a-zA-Z0-9]{3,30}$/),

                }
            }
        }
    }

];
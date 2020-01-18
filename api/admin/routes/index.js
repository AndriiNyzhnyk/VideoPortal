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
    {
        path: '/upload/movie',
        method: 'POST',
        handler: controllers.movieFileUpload,
        options: {
            auth: false,
            payload: {
                output: 'stream',
                maxBytes: 10737418240 // 10 Gb
            }
        }
    },
    {
        path: '/upload/image',
        method: 'POST',
        handler: controllers.imageFileUpload,
        options: {
            auth: false,
            payload: {
                output: 'stream',
                maxBytes: 10737418240 // 10 Gb
            }
        }
    },
    {
        path: '/new-movie',
        method: 'POST',
        handler: controllers.addNewMovie,
        options: {
            auth: false,
            validate: {
                payload: Joi.object({
                    nameUa: Joi.string().min(1).max(100).required(),
                    nameEn: Joi.string().min(1).max(100).required(),
                    sourceImg: Joi.string().min(1).max(100).required(),
                    sourceVideo: Joi.string().min(1).max(100).required(),
                    qualityVideo: Joi.number().integer().min(144).max(4320).required(),
                    translation: Joi.string().min(1).max(100).required(),
                    motto: Joi.string().min(1).max(100).required(),
                    year: Joi.number().integer().min(1).max(3000).required(), // number
                    // year: Joi.string().min(1).max(4).required(), // test
                    country: Joi.string().min(1).max(100).required(),
                    genre: Joi.array().items(Joi.string()),
                    category: Joi.array().items(Joi.string()),
                    producer: Joi.string().min(1).max(100).required(),
                    duration: Joi.number().integer().min(1).max(100).required(),
                    age: Joi.number().integer().min(1).max(100).required(),
                    // duration: Joi.string().min(1).max(1000).required(), // test
                    // age: Joi.string().min(1).max(100).required(), // test
                    firstRun: Joi.date().required(),
                }),
                options: {
                    allowUnknown: false
                }
            }
        }
    }
];
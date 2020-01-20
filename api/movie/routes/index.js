'use strict';

const Joi = require('@hapi/joi');
const { Movie, Comment } = require('../../../models');
const controllers = require('../controllers/movie');

module.exports = [
    {
        method: 'GET',
        path: '/movie-test',
        handler: controllers.test,
        options: { auth: false }
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
    },
    {
        method: 'POST',
        path: '/comment',
        handler: controllers.addNewComment,
        options: { auth: false },
    },
    {
        method: 'GET',
        path: '/movies/pagination',
        handler: controllers.moviePagination,
        options: {
            auth: false,
            validate: {
                query: Joi.object({
                    start: Joi.number().integer().min(0).max(100).required(),
                    limit: Joi.number().integer().min(1).max(1000).required(),
                    sort: Joi.string().min(1).max(100).required()
                }),
                options: {
                    allowUnknown: false
                }
            }
        }
    }
];
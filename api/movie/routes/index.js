'use strict';

const Path = require('path');
const Joi = require('@hapi/joi');
const controllers = require('../controllers/movie');

module.exports = [
    {
        method: 'GET',
        path: '/',
        handler: controllers.mainPage,
        options: { auth: false }
    },
    {
        method: 'GET',
        path: '/movie-test',
        handler: controllers.test,
        options: { auth: false }
    },
    {
        method: 'GET',
        path: '/movie/page/{movieId}',
        handler: controllers.prepareMoviePage,
        options: {
            auth: false,
            validate: {
                params: Joi.object({
                    movieId: Joi.string().min(24).max(24)
                })
            }
        }
    },
    {
        method: 'GET',
        path: '/movie/download/{movieId}',
        handler:  controllers.downloadMovie,
        options: {
            auth: false,
            validate: {
                params: Joi.object({
                    movieId: Joi.string().min(24).max(24)
                })
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
                    //category: Joi.array().items(Joi.string()),
                    producer: Joi.string().min(1).max(100).required(),
                    duration: Joi.number().integer().min(1).max(1000).required(),
                    age: Joi.number().integer().min(1).max(100).required(),
                    // // duration: Joi.string().min(1).max(1000).required(), // test
                    // // age: Joi.string().min(1).max(100).required(), // test
                    firstRun: Joi.date().required(),
                    artists: Joi.string().min(1).max(3000).required(),
                    description: Joi.string().min(1).max(3000).required(),
                    comments: Joi.array().items(Joi.string()).required()
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
        handler: controllers.addNewCommentToMovie,
        options: { auth: 'jwt' },
    },
    {
        method: 'GET',
        path: '/movies/pagination',
        handler: controllers.moviePagination,
        options: {
            auth: false,
            validate: {
                query: Joi.object({
                    search: Joi.string().allow('').max(100),
                    start: Joi.number().integer().min(0).max(100).required(),
                    limit: Joi.number().integer().min(1).max(1000).required(),
                    sort: Joi.string().min(3).max(100)
                }),
                options: {
                    allowUnknown: false
                }
            },
            // response: {
            //     schema: Joi.array().items().min(0).max(1000).required()
            // },

            // response: Joi.object({
            //     total: Joi.number().integer().min(0).max(1000).required(),
            //     data: Joi.array().items().min(0).max(1000).required()
            // }),
        }
    },
    {
        method: 'GET',
        path: '/movie/static/{param*}',
        handler: {
            directory: {
                path: Path.resolve(__dirname, '../../../uploads')
            }
        },
        options: { auth: false }
    },
    {
        method: 'GET',
        path: '/movie/watch/{movieId}',
        handler: controllers.watchMovie,
        options: {
            auth: false,
            validate: {
                params: Joi.object({
                    movieId: Joi.string().min(24).max(24).required()
                })
            }
        }
    },
    {
        method: 'GET',
        path: '/movie/search/{filter}',
        handler: controllers.searchMovie,
        options: {
            auth: false,
            validate: {
                params: Joi.object({
                    filter: Joi.string().allow('').max(360).required()
                })
            }
        }
    },
];
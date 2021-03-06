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
                    year: Joi.number().integer().min(1).max(3000).required(),
                    country: Joi.string().min(1).max(100).required(),
                    genres: Joi.array().items(Joi.string()).required(),
                    artists: Joi.array().items(Joi.string()).required(),
                    producer: Joi.string().min(1).max(100).required(),
                    duration: Joi.number().integer().min(1).max(1000).required(),
                    age: Joi.number().integer().min(1).max(100).required(),
                    firstRun: Joi.date().iso().required(),
                    description: Joi.string().min(1).max(3000).required()
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
        options: {
            auth: 'jwt',
            validate: {
                payload: Joi.object({
                    movieId: Joi.string().min(1).max(24).required(),
                    comment: Joi.string().min(1).max(3000).required(),
                }),
                options: {
                    allowUnknown: false
                }
            },
            response: {
                schema: Joi.object({
                    _id: Joi.string().min(1).max(24).required(),
                    posted: Joi.date().required(),
                    author: Joi.string().min(1).max(100).required(),
                    movie: Joi.string().min(1).max(24).required(),
                    text: Joi.string().min(1).max(3000).required(),
                    __v: Joi.number().integer().min(0).max(1000).required(),
                }),
                failAction: 'error'
            },
        },
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
            response: {
                schema: Joi.object({
                    total: Joi.number().integer().min(0).max(1000).required(),
                    data: Joi.array().items(
                        // Joi.object({
                        //     _id: Joi.string().min(1).max(24).required(),
                        //     views: Joi.number().integer().min(0).max(10000),
                        //     nameUa: Joi.string().min(1).max(100).required(),
                        //     nameEn: Joi.string().min(1).max(100).required(),
                        //     sourceImg: Joi.string().min(1).max(100).required(),
                        //     producer: Joi.string().min(1).max(100).required(),
                        //     artist: Joi.string().min(1).max(10000).required(),
                        // })
                    ).max(Joi.ref('total')).required()
                }),
                failAction: 'error'
            }
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
    {
        method: 'POST',
        path: '/movie/favourite',
        handler: controllers.addNewMovieToFavourites,
        options: {
            auth: 'jwt',
            validate: {
                payload: Joi.object({
                    movieId: Joi.string().length(24).required(),
                }),
                options: {
                    allowUnknown: false
                }
            },
        }
    },
];
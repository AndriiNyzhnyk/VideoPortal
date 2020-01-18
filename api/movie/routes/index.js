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
        handler: async (req, h) => {
            try {
                console.log(req.payload);

                const comment = await Comment.addNewComment(req.payload);
                console.log(comment);
                const ttt = await Movie.addNewCommentToMovie(comment.movie, comment._id);
                console.log(ttt);

                return h.response();
            } catch (err) {
                console.error(err);
            }
        },
        options: { auth: false },
    },
];
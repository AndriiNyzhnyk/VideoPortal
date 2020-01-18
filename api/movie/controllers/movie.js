'use strict';

const Boom = require('@hapi/boom');
const Helpers = require('../helpers/movie');

const self = module.exports = {
    test: async (req, h) => {
        return h.response('test');
    },

    addNewMovie: async (req, h) => {
        try {
            const movie = await Helpers.createNewMovie(req.payload);
            console.log(movie);

            return h.response();
        } catch (err) {
            console.error(err);
            return Boom.badImplementation('Internal server error!');
        }
    },

    addNewComment: async (req, h) => {
        try {
            console.log(req.payload);
            await Helpers.createNewCommentAndAttachToMovie(req.payload);

            return h.response();
        } catch (err) {
            console.error(err);
            return Boom.badImplementation('Internal server error!');
        }
    },
};
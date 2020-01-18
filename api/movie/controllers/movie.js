'use strict';

const { Movie } = require('../../../models');
const Boom = require('@hapi/boom');
const Helpers = require('../helpers/movie');

const self = module.exports = {
    test: async (req, h) => {
        return h.response('test');
    },
    addNewMovie: async (req, h) => {
        try {
            const movie = await Movie.addNewMovieToDb(req.payload);
            console.log(movie);

            return h.response();
        } catch (err) {
            console.log(err);
            return Boom.badImplementation('Internal server error!');
        }
    }
};
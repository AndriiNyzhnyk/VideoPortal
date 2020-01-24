'use strict';

const Boom = require('@hapi/boom');
const Helpers = require('../helpers/movie');

const self = module.exports = {
    /**
     * Test route
     * @param {Object} req
     * @param {Object} h
     * @returns {Promise<Boom<unknown>|*>}
     */
    test: async (req, h) => {
        return h.response('test');
    },

    /**
     * Create a new entry (movie) into DB
     * @param {Object} req
     * @param {Object} h
     * @returns {Promise<Boom<unknown>|*>}
     */
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

    /**
     * Create a new entry (comment) into DB and attach to movie
     * @param {Object} req
     * @param {Object} h
     * @returns {Promise<Boom<unknown>|*>}
     */
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

    /**
     * Get movies pagination list
     * @param {Object} req
     * @param {Object} h
     * @returns {Promise<Boom<unknown>|*>}
     */
    moviePagination: async (req, h) => {
        try {
            console.log(req.query);
            const result = await Helpers.getMoviePaginationList(req.query);

            return h.response(result);
        } catch (err) {
            console.error(err);
            return Boom.badImplementation('Internal server error!');
        }
    }
};
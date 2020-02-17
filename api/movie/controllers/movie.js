'use strict';

const Path = require('path');
const Boom = require('@hapi/boom');
const Helpers = require('../helpers/movie');
const { Movie } = require('../../../models');

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
     * @returns {Promise<Boom<Object>|| Object*>}
     */
    prepareMoviePage: async (req, h) => {
        try {
            const movieId = req.params.movieId;
            const movieIdError = await Helpers.validateMovieId(movieId);

            if (movieIdError) {
                return movieIdError;
            }

            const movieData = await Helpers.prepareDataForMoviePage(movieId);

            return h.view('moviePage', movieData);
        } catch (err) {
            console.log(err);
            return Boom.badImplementation('Internal server error!');
        }
    },

    downloadMovie: async (req, h) => {
        try {
            const movieId = req.params.movieId;
            const movieIdError = await Helpers.validateMovieId(movieId);

            if (movieIdError) {
                return movieIdError;
            }

            const pathToMovie = Path.resolve(__dirname, '../../../uploads/movies/it.mp4');

            return h.file(pathToMovie, {
                confine: false,
                mode: 'attachment'
            });
        } catch (err) {
            console.error(err);
            return Boom.badImplementation('Internal server error!');
        }
    },

    /**
     * Create a new entry (movie) into DB
     * @param {Object} req
     * @param {Object} h
     * @returns {Promise<Boom<Object>|| Object*>}
     */
    addNewMovie: async (req, h) => {
        try {
            return await Helpers.createNewMovie(req.payload);
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
    addNewCommentToMovie: async (req, h) => {
        try {
            return await Helpers.createNewCommentAndAttachToMovie(req.payload);
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
            return await Helpers.getMoviePaginationList(req.query);
        } catch (err) {
            console.error(err);
            return Boom.badImplementation('Internal server error!');
        }
    }
};
'use strict';

const Path = require('path');
const Boom = require('@hapi/boom');
const Helpers = require('../helpers/movie');

const self = module.exports = {
    /**
     * SRR for main page with slider and other important info
     * @returns {Promise<*>}
     */
    mainPage: async (req, h) => {
        const data = await Helpers.prepareDataForMainPage();
        return h.view('home', data);
    },

    /**
     * Test route
     * @returns {Promise<Boom<unknown>|*>}
     */
    test: async (req, h) => {
        return h.response('test');
    },

    /**
     * Create a new entry (movie) into DB
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

    /**
     * Add ability download movie to client
     * @returns {Promise<Boom || *>}
     */
    downloadMovie: async (req, h) => {
        try {
            const { createPathToMovie } = req.server.methods;
            const movieId = req.params.movieId;
            const movieIdError = await Helpers.validateMovieId(movieId);

            if (movieIdError) {
                return movieIdError;
            }

            const pathToMovie = await createPathToMovie(movieId);

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
     * @returns {Promise<Boom<unknown>|*>}
     */
    addNewCommentToMovie: async (req, h) => {
        try {
            const data = {
                author: req.info.userClient._id.toString(),
                movie: req.payload.movieId,
                text: req.payload.comment
            };

            return await Helpers.createNewCommentAndAttachToMovie(data);
        } catch (err) {
            console.error(err);
            return Boom.badImplementation('Internal server error!');
        }
    },

    /**
     * Get movies pagination list
     * @returns {Promise<Boom<unknown>|*>}
     */
    moviePagination: async (req, h) => {
        try {
            return await Helpers.getMoviePaginationList(req.query);
        } catch (err) {
            console.error(err);
            return Boom.badImplementation('Internal server error!');
        }
    },

    /**
     * All logic related to watching movie (real-time stream, etc)
     * @returns {Promise<*>}
     */
    watchMovie: async (req, h) => {
        try {
            const SM = req.server.methods;
            const movieId = req.params.movieId;
            const statusCode = 206;

            const movieIdError = await Helpers.validateMovieId(movieId);

            if (movieIdError) {
                return movieIdError;
            }

            // Preparing data for real-time video stream
            const pathToMovie = await SM.createPathToMovie(movieId);
            const range = req.headers.range;
            const { file, isRange, data } = await Helpers.videoStream(pathToMovie, range);
            const headers = isRange ?
                await Helpers.getHeadersForRangeMood(data) :
                await Helpers.getHeadersForInitMood(data);

            const response = h.response(file);
            response.statusCode = statusCode;

            return Helpers.setHeaders(response, headers);
        } catch (err) {
            console.error(err);
            return Boom.badImplementation('Internal server error!');
        }
    },

    /**
     * Return search page with needed information
     * @returns {Promise<Boom<unknown>|*>}
     */
    searchMovie: async (req, h) => {
        try {
            const filter = req.params.filter;

            return h.view('searchPage', {filter});
        } catch (err) {
            console.error(err);
            return Boom.badImplementation('Internal server error!');
        }
    }
};
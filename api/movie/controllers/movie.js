'use strict';

const Path = require('path');
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
    },

    watchMovie: async (req, h) => {
        try {
            const SM = req.server.methods;

            // Preparing headers and status code for response (depends on browsers request)
            const statusCode = 206;

            const getHeadersForRangeMood = ({start, end, chunkSize, fileSize}) => {
                return [
                    ['Content-Range', `bytes ${start}-${end}/${fileSize}`],
                    ['Accept-Ranges', 'bytes'],
                    ['Content-Length', chunkSize],
                    ['Content-Type', 'video/mp4']
                ];
            };

            const getHeadersForInitMood = ({fileSize}) => {
                return [
                    ['Content-Length', fileSize],
                    ['Content-Type', 'video/mp4']
                ];
            };

            // Preparing data for real-time video stream
            const movieName = await SM.securityParamsFilter(req.params.name, true);
            const pathToMovie = await SM.createPathToMovie(movieName + '.mp4');
            const range = req.headers.range;

            const {file, isRange, data} = await Helpers.videoStream(pathToMovie, range);
            const headers = isRange ? getHeadersForRangeMood(data) : getHeadersForInitMood(data);

            const response = h.response(file);
            response.statusCode = statusCode;
            return Helpers.setHeaders(response, headers);
        } catch (err) {
            console.error(err);
        }
    }
};
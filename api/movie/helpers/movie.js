'use strict';

const FS = require('fs');
const {promisify: Promisify} = require('util');
const statAsync = Promisify(FS.stat);

const Mongoose = require('mongoose');
const ObjectId = Mongoose.Types.ObjectId;
const { Movie, Comment } = require('../../../models');

const self = module.exports = {
    /**
     * Add new movie to DB
     * @param {Object} payload Movie meta data
     * @returns {Promise<Object>}
     */
    createNewMovie: async (payload) => {
        return Movie.addNewMovieToDb(payload);
    },

    /**
     * Prepare some data for SSR main page
     * @returns {Promise<Object>}
     */
    prepareDataForMainPage: async () => {
        const query = {
            start: 0,
            limit: 15,
            sort: 'firstRun:desc'
        };

        const movies = await Movie.getAllMoviesPagination(query, [], true);

        return { moviesSlider: movies };
    },

    /**
     * Prepare some data for SSR movie page
     * @param {String} movieId
     * @returns {Promise<Object>}
     */
    prepareDataForMoviePage: async (movieId) => {
        const movie = await Movie.findMovieById(movieId, ['comments'], true);
        let editedMovie = Object.assign(Object.create(null), movie);

        const firstRun = new Date(movie.firstRun);

        editedMovie.artist = movie.artist.split(',');
        editedMovie.firstRun = `${firstRun.getDate()}-${firstRun.getMonth()}-${firstRun.getFullYear()}`;
        editedMovie.comments = movie.comments.map((comment) => {
            comment.posted = new Date(comment.posted).toISOString();
            return comment;
        });

        return editedMovie;
    },

    /**
     * Create new comment and add references on comments to movie
     * @param {Object} commentPayload
     * @returns {Promise<Object>}
     */
    createNewCommentAndAttachToMovie: async (commentPayload) => {
        const comment = await Comment.addNewComment(commentPayload);
        await Movie.attachNewCommentToMovie(comment.movie, comment._id);
        return comment;
    },

    /**
     * Return movies list according to query with pagination
     * @param {Object} query
     * @returns {Promise<Array>}
     */
    getMoviePaginationList: async (query) => {
        const populateCollections = ['comments'];

        return Movie.getAllMoviesPagination(query, populateCollections);
    },

    /**
     * Validate movieId as MongoDb ObjectId and check if document exists into DB
     * @param {String} movieId
     * @returns {Promise<null|void>}
     */
    validateMovieId: async (movieId) => {
        if ( !ObjectId.isValid(movieId) ) {
            return Boom.badRequest();
        }

        const exists = await Movie.checkIfDocExistsById(movieId);

        if (!exists) {
            return Boom.notFound('This movie not found');
        }

        return null;
    },

    /**
     * Service for reading some part of the movie and then stream to the client
     * @param {String} pathToMovie
     * @param {String} range
     * @returns {Promise<{file: ReadStream, data: {fileSize: *}, isRange: boolean}|{file: ReadStream, data: {chunkSize: number, fileSize: *, start: number, end: number}, isRange: boolean}>}
     */
    videoStream: async (pathToMovie, range) => {
        const stat = await statAsync(pathToMovie);
        const fileSize = stat.size;

        if (range) {
            const parts = range.replace(/bytes=/, "").split("-");
            const start = parseInt(parts[0], 10);

            const end = parts[1]
                ? parseInt(parts[1], 10)
                : fileSize - 1;

            const chunkSize = (end - start) + 1;
            const file = FS.createReadStream(pathToMovie, {start, end});
            const data = {
                start,
                end,
                chunkSize,
                fileSize
            };

            return {file, isRange: true, data};
        } else {
            const file = FS.createReadStream(pathToMovie);
            const data = {fileSize};

            return {file, isRange: false, data};
        }
    },

    /**
     * Set all needed headers for web browser
     * @param {Object} response
     * @param {Array} headers
     * @returns {*}
     */
    setHeaders: (response, headers) => {
        for(let header of headers) {
            response.header(header[0], header[1]);
        }

        return response;
    },

    /**
     * Get headers for range mood. When movie is playing
     * @param {Number} start
     * @param {Number} end
     * @param {Number} chunkSize
     * @param {Number} fileSize
     * @returns {Promise<Array>}
     */
    getHeadersForRangeMood: ({start, end, chunkSize, fileSize}) => {
        return new Promise((resolve) => {
            resolve([
                ['Content-Range', `bytes ${start}-${end}/${fileSize}`],
                ['Accept-Ranges', 'bytes'],
                ['Content-Length', chunkSize],
                ['Content-Type', 'video/mp4']
            ]);
        });
    },

    /**
     * Get headers for init mood. When movie starting playing.
     * @param {Number} fileSize
     * @returns {Promise<Array>}
     */
    getHeadersForInitMood: ({fileSize}) => {
        return new Promise((resolve) => {
            resolve([
                ['Content-Length', fileSize],
                ['Content-Type', 'video/mp4']
            ]);
        });
    }
};
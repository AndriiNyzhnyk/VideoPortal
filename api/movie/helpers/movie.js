'use strict';

const FS = require('fs');
const {promisify: Promisify} = require('util');
const statAsync = Promisify(FS.stat);

const Mongoose = require('mongoose');
const ObjectId = Mongoose.Types.ObjectId;
const { Movie, Comment, User } = require('../../../models');

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
        const select = {
            _id: 1,
            nameEn: 1,
            nameUa: 1,
            sourceImg: 1
        };
        const query = {
            start: 0,
            limit: 15,
            sort: 'firstRun:desc'
        };

        const movies = await Movie.getAllMoviesPagination(query, [], select, true);

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
        editedMovie.firstRun = `${firstRun.getDate()}-${firstRun.getMonth()}-${firstRun.getFullYear()}`;

        editedMovie.comments = movie.comments.map((comment) => {
            comment.posted = new Date(comment.posted).toISOString();
            return comment;
        });

        // Increment views counter for movie
        Movie.incrementViewsCounter(movieId).then();

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
        return JSON.parse(JSON.stringify(comment));
    },

    /**
     * Return movies list according to query with pagination
     * @param {Object} query
     * @returns {Promise<Object>}
     */
    getMoviePaginationList: async (query) => {
        const select = {
            nameEn: 1,
            nameUa: 1,
            sourceImg: 1,
            producer: 1,
            artist: 1,
            views: 1
        };

        const movies = await Movie.getAllMoviesPagination(query, [], select);
        const moviesCount = await Movie.moviesPaginationCount(query);

        return {
            total: moviesCount,
            data: movies
        };
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
     * @returns {Promise<Object>}
     */
    setHeaders: (response, headers) => {
        return new Promise((resolve) => {
            for(let header of headers) {
                response.header(header[0], header[1]);
            }

            resolve(response);
        });
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
    },

    addThisMovieToFavourites: (userId, movieId) => {
        return User.addMovieToFavourites(userId, movieId);
    }
};
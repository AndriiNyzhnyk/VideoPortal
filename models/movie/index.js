'use strict';

const Movie = require('./Movie');

const self = module.exports = {
    /**
     * Create new entry into DB
     * @param {Object} payload
     * @returns {Promise<Object>}
     */
    addNewMovieToDb: async (payload) => {
        return Movie.create(payload);
    },

    /**
     * Add new comment to movie
     * @param {String} movieId
     * @param {String} commentId
     * @returns {Promise<Object>}
     */
    addNewCommentToMovie: async (movieId, commentId) => {
        return Movie.findByIdAndUpdate(movieId, { $push: { comments: commentId }});
    },

    /**
     * Fetch all movies from DB
     * @param {Object} filter
     * @param {Number} limit
     * @returns {Promise<Object>}
     */
    getAllMovies: async (filter = {}, limit = 100) => {
        return Movie.find(filter, null, {limit});
    },

    /**
     * Fetch all movies filtered by pagination condition
     * @param {Number} start
     * @param {Number} limit
     * @param {String} order
     * @returns {Promise<Array>}
     */
    getAllMoviesPagination: async (start, limit, order) => {
        const [fieldName, value] = order.split(':');
        const sort = {
            [`${fieldName}`]: value === 'asc' ? 1 : -1
        };

        return Movie.find({}, null, {
            skip: start,
            limit,
            sort
        });
    }
};
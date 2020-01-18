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
     * @param {Number} limit
     * @returns {Promise<Object>}
     */
    getAllMovies: async (limit = 100) => {
        return Movie.find({}, null, {limit});
    }
};
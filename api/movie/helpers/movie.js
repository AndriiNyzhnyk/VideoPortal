'use strict';

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
     * Create new comment and add references on comments to movie
     * @param {Object} commentPayload
     * @returns {Promise<Object>}
     */
    createNewCommentAndAttachToMovie: async (commentPayload) => {
        const comment = await Comment.addNewComment(commentPayload);
        console.log(comment);
        const movie = await Movie.attachNewCommentToMovie(comment.movie, comment._id);
        console.log(movie);

        return movie;
    },

    /**
     * Return movies list according to query with pagination
     * @param {Object} query
     * @returns {Promise<Array>}
     */
    getMoviePaginationList: async (query) => {
        const populateCollections = ['comments'];

        return Movie.getAllMoviesPagination(query, populateCollections);
    }
};
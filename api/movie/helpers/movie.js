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
     * Prepare some data for SSR movie page
     * @param {String} movieId
     * @returns {Promise<Object>}
     */
    prepareDataForMoviePage: async (movieId) => {
       const movie = await Movie.findMovieById(movieId, true);
        let editedMovie = Object.assign(Object.create(null), movie);

        editedMovie.artist = movie.artist.split(',');

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
    }
};
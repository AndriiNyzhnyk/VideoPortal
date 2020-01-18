'use strict';

const Movie = require('./Movie');

const self = module.exports = {
    addNewMovieToDb: async (payload) => {
        return Movie.create(payload);
    },

    addNewCommentToMovie: async (movieId, commentId) => {
        return Movie.findByIdAndUpdate(movieId, { $push: { comments: commentId }});
    }
};
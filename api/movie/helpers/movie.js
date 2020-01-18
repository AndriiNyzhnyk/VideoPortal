'use strict';

const { Movie, Comment } = require('../../../models');

const self = module.exports = {
    createNewMovie: async (payload) => {
        return Movie.addNewMovieToDb(payload);
    },

    createNewCommentAndAttachToMovie: async (commentPayload) => {
        const comment = await Comment.addNewComment(commentPayload);
        console.log(comment);
        const movie = await Movie.addNewCommentToMovie(comment.movie, comment._id);
        console.log(movie);

        return movie;
    }
};
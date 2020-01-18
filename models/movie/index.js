'use strict';

const Movie = require('./Movie');

const self = module.exports = {
    addNewMovieToDb: async (payload) => {
        return Movie.create(payload);
    }
};
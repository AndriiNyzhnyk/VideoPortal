'use strict';

const Movie = require('./Movie');

const self = module.exports = {
    /**
     * Create new entry into DB
     * @param {Object} payload
     * @returns {Promise<Object>}
     */
    addNewMovieToDb: (payload) => {
        return Movie.create(payload);
    },

    /**
     * Find movie by _id
     * @param {String} movieId
     * @returns {Promise<Object>}
     */
    findMovieById: (movieId) => {
        return Movie.findById(movieId);
    },


    /**
     * Remove movie by '_id'
     * @param {Object || Number || String} movieId
     * @returns {Promise<*>}
     */
    removeMovieById: (movieId) => {
        return Movie.findByIdAndRemove(movieId);
    },

    /**
     * Add new comment to movie
     * @param {String} movieId
     * @param {String} commentId
     * @returns {Promise<Object>}
     */
    attachNewCommentToMovie: async (movieId, commentId) => {
        // Attach new comment to movie if movie.comments.length < 30
        return Movie.findByIdAndUpdate(movieId, {
            $push: {
                comments: {
                    $each: [ commentId ],
                    $sort: 1,
                    $slice: 30
                }
            }
        });
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
     * @param {Object} query
     * @param {Array} populateCollections
     * @returns {Promise<Array>}
     */
    getAllMoviesPagination: async (query, populateCollections = []) => {
        const { start, limit, sort } = query;

        const populate = populateCollections.join(' ');
        const [fieldName, value] = sort.split(':');
        const sortCondition = {
            [`${fieldName}`]: value === 'asc' ? 1 : -1
        };

        return Movie
        .find({}, null, {
            skip: start,
            limit,
            sort: sortCondition
        })
        .populate(populate);
    }
};
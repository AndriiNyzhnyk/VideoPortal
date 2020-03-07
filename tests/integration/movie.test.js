'use strict';

const { server, launch } = require('../../server.js'); // Import Server/Application
const Mongoose = require('mongoose');
const Services = require('../services');
const Chance = require('chance');
const _ = require('lodash');

const { Movie, Comment } = require('../../models');

const localState = new Map();
const chance = new Chance();

// Start application before running the test case
beforeAll(async (done) => {
    server.events.on('start', () => {
        done();
    });

    await launch();
});

// Stop application after running the test case
afterAll(async (done) => {
    server.events.on('stop', () => {
        done();
    });

    await Mongoose.connection.close();
    await server.stop();
});


describe('Tests for movie', () => {
    test('Import tokens', async () => {
        const requestOptions = Services.getAuthRequestOptions();

        // Make request
        const response = await server.inject(requestOptions);
        expect(response.statusCode).toBe(200);

        const result = response.result;
        const accessToken = result['accessToken'];
        const refreshToken = result['refreshToken'];

        expect(accessToken).toBeDefined();
        expect(refreshToken).toBeDefined();

        // Save tokens to cache
        localState.set('accessToken', accessToken);
        localState.set('refreshToken', refreshToken);
    });
});


describe('Tests for movie', () => {
    test('Should add new movie to DB', async  () => {
        const fakeMovie = Services.createFakeDataForMovie();

        const options = {
            method: 'POST',
            url: '/new-movie',
            payload: JSON.stringify(fakeMovie)
        };

        // Make request
        const response = await server.inject(options);
        const result = JSON.parse(JSON.stringify(response.result));

        // Omit MongoDD internal fields
        const bodyComment = _.omit(result, ['_id', '__v']);

        // Extend fake movie object according to Mongoose default values
        fakeMovie.comments = [];
        fakeMovie.views = 0;

        expect(response.statusCode).toBe(200);
        expect(typeof result).toMatch('object');
        expect(bodyComment).toEqual(fakeMovie);

        localState.set('movieId', result._id.toString());
    });
});

// describe('Tests for comments', () => {
//     test('Should add new comment to DB', async  () => {
//         const accessToken = localState.get('accessToken');
//
//         const fakeComment = {
//             author: "5e56bdcf2ab14332e5b33357",
//             movie: localState.get('movieId'),
//             text: chance.paragraph()
//         };
//
//         const options = {
//             method: 'POST',
//             url: '/comment',
//             payload: JSON.stringify(fakeComment),
//             headers: {
//                 Authorization: accessToken
//             }
//
//         };
//
//         // Make request
//         const response = await server.inject(options);
//         const result = JSON.parse(JSON.stringify(response.result));
//         const bodyComment = _.omit(result, ['_id', '__v', 'posted']);
//
//         expect(response.statusCode).toBe(200);
//         expect(typeof result).toMatch('object');
//         expect(bodyComment).toEqual(fakeComment);
//
//         localState.set('commentId', result._id);
//     });
// });

describe('Remove all related data', () => {
    test('Should remove previously created movie into DB', async  () => {
        const movieId = localState.get('movieId');

        // Remove movie
        const removedMovie = await Movie.removeMovieById(movieId);
        expect(typeof removedMovie).toMatch('object');

        // Try to find movie again into DB. Should return null if movie was removed correctly.
        const movie = await Movie.findMovieById(movieId);
        expect(movie).toBeNull();
    });

    test('Should remove previously created comment into DB', async  () => {
        const commentId = localState.get('commentId');

        // Remove movie
        const removedComment = await Comment.removeCommentById(commentId);
        expect(typeof removedComment).toMatch('object');

        // Try to find comment again into DB. Should return null if movie was removed correctly.
        const movie = await Comment.findCommentById(commentId);
        expect(movie).toBeNull();
    });
});
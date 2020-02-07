'use strict';

const { server, launch } = require('../../server.js'); // Import Server/Application
const Mongoose = require('mongoose');
const _ = require('lodash');


const Movie = require('../../models/movie');
const Comment = require('../../models/comment');

const localStorage = new Map();

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
    test('Should add new movie to DB', async  () => {
        const now = Date.now();
        const oneMinute = 60 * 1000; // Count milliseconds into 1 minute

        const fakeMovie = {
            nameUa: 'Титанік',
            nameEn: 'Deep',
            sourceImg: '/img/pick',
            sourceVideo: '/movie/pick',
            qualityVideo: 1080,
            translation: 'Any',
            motto: 'Horror',
            year: 2020, // number
            // year: '2020', // string
            country: 'USA',
            genre: ['Pop', 'Roc'],
            producer: 'Andrii Nyzhnyk',
            duration: 134,
            age: 18,
            // duration: Joi.string().min(1).max(1000).required(), // test
            // age: Joi.string().min(1).max(100).required(), // test
            firstRun: new Date().toISOString(),
            artists: 'Білл Скарсгард, Метт Деймон, ТіДжей Міллер, Террі Крюс',
            description: 'Переживши майже смертельну вірусну діаре',
            comments: []
        };

        const options = {
            method: 'POST',
            url: '/new-movie',
            payload: JSON.stringify(fakeMovie)
        };

        // Make request
        const response = await server.inject(options);
        const result = JSON.parse(JSON.stringify(response.result));
        const bodyComment = _.omit(result, ['_id', '__v']);

        expect(response.statusCode).toBe(200);
        expect(typeof result).toMatch('object');
        expect(bodyComment).toEqual(fakeMovie);

        localStorage.set('movieId', result._id.toString());
    });
});

describe('Tests for comments', () => {
    test('Should add new comment to DB', async  () => {
        const now = Date.now();
        const oneMinute = 60 * 1000; // Count milliseconds into 1 minute

        const fakeComment = {
            author: "5e089aa46d8f4523d64f5215",
            movie: localStorage.get('movieId'),
            text: "TEst test test 888888888888888888888888"
        };

        const options = {
            method: 'POST',
            url: '/comment',
            payload: JSON.stringify(fakeComment)
        };

        // Make request
        const response = await server.inject(options);
        const result = JSON.parse(JSON.stringify(response.result));
        const bodyComment = _.omit(result, ['_id', '__v', 'posted']);

        expect(response.statusCode).toBe(200);
        expect(typeof result).toMatch('object');
        expect(bodyComment).toEqual(fakeComment);

        // Check if posted time is correct
        const afterOneMinute = now + oneMinute;
        const oneMinuteAgo = now - oneMinute;
        expect( new Date(result.posted).getTime() ).toBeGreaterThanOrEqual(oneMinuteAgo);
        expect( new Date(result.posted).getTime() ).toBeLessThanOrEqual(afterOneMinute);

        localStorage.set('commentId', result._id);
    });
});

describe('Remove all related data', () => {
    test('Should remove previously created movie into DB', async  () => {
        const movieId = localStorage.get('movieId');

        // Remove movie
        const removedMovie = await Movie.removeMovieById(movieId);
        expect(typeof removedMovie).toMatch('object');

        // Try to find movie again into DB. Should return null if movie was removed correctly.
        const movie = await Movie.findMovieById(movieId);
        expect(movie).toBeNull();
    });

    test('Should remove previously created comment into DB', async  () => {
        const commentId = localStorage.get('commentId');

        // Remove movie
        const removedComment = await Comment.removeCommentById(commentId);
        expect(typeof removedComment).toMatch('object');

        // Try to find comment again into DB. Should return null if movie was removed correctly.
        const movie = await Comment.findCommentById(commentId);
        expect(movie).toBeNull();
    });
});
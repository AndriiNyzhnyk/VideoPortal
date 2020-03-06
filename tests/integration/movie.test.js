'use strict';

const { server, launch } = require('../../server.js'); // Import Server/Application
const Mongoose = require('mongoose');
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
    test('Should add new movie to DB', async  () => {
        const fakeMovie = {
            nameUa: chance.word(),
            nameEn: chance.word(),
            sourceImg: `/${chance.word()}/${chance.word()}.jpg`,
            sourceVideo: `/${chance.word()}/${chance.word()}.mp4`,
            qualityVideo: chance.integer({min: 144, max: 4320}),
            translation: chance.word(),
            motto: chance.word(),
            year: Number.parseInt(chance.year({min: 2000, max: 2100})),
            country: chance.word(),
            genre: [chance.word(), chance.word(), chance.word()],
            producer: chance.name(),
            duration: chance.integer({ min: 15, max: 1000 }),
            age: chance.integer({ min: 8, max: 100 }),
            firstRun: new Date(chance.date()).toISOString(),
            artists: `${chance.name()}, ${chance.name()}, ${chance.name()}, ${chance.name()}, ${chance.name()}`,
            description: chance.paragraph()
        };

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

describe('Tests for comments', () => {
    test('Should add new comment to DB', async  () => {
        const now = Date.now();
        const oneMinute = 60 * 1000; // Count milliseconds into 1 minute

        const fakeComment = {
            author: "5e089aa46d8f4523d64f5215",
            movie: localState.get('movieId'),
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

        localState.set('commentId', result._id);
    });
});

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
'use strict';

const { server, launch } = require('../../server.js'); // Import Server/Application
const Mongoose = require('mongoose');
const _ = require('lodash');

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

describe('Tests for comments', () => {
    test('Should add new comment to DB', async  () => {
        const now = Date.now();
        const oneMinute = 60 * 1000; // Count milliseconds into 1 minute

        const fakeComment = {
            author: "5e089aa46d8f4523d64f5215",
            movie: "5e233addfb18cf5b3c09fd5b",
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
    });
});
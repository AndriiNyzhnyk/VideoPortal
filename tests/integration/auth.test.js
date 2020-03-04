'use strict';

const { server, launch } = require('../../server.js'); // Import Server/Application
const Mongoose = require('mongoose');
const _ = require('lodash');

const { User, PendingUser } = require('../../models');

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


describe('Sign up process', () => {

    test('Check if localStorage for user is empty', () => {
        expect(localStorage.size).toEqual(0);
    });

    test('Should create new user(MAP js) into localStorage', () => {
        const user = {
            userName: 'TestUser1',
            email: 'limoto19@gmail.com',
            password: 'TempPass123!'
        };

        localStorage.set('user', user);

        expect(localStorage.has('user')).toEqual(true);
        expect(localStorage.size).toEqual(1);
    });

    test('Sign up user request', async () => {
        const user = localStorage.get('user');

        const options = {
            method: 'POST',
            url: '/registration',
            payload: JSON.stringify(user)
        };

        // Make request
        const response = await server.inject(options);

        expect(response.statusCode).toBe(204);
    });

    test('Check if user is saved into DB', async () => {
        const user = localStorage.get('user');

        // Add user from DB to cache
        const dbUser = await User.fetchUserByNameOrEmail(user.userName);
        localStorage.set('dbUser', dbUser);

        expect(dbUser).toBeTruthy();
    });
});


describe('Activate user', () => {

    test('Check if user is not active', () => {
        const user = localStorage.get('dbUser');
        expect(user.active).toBeFalsy();
    });

    test('Activate user', async () => {
        const user = localStorage.get('dbUser');

        const pendingUser = await PendingUser.fetchOne({ userId: user._id });
        expect(pendingUser).toBeTruthy();

        const { activateCode } = pendingUser;
        expect(activateCode).toBeTruthy();

        const options = {
            method: 'GET',
            url: `/activate-user/${activateCode}`
        };

        // Make request
        const response = await server.inject(options);
        expect(response.statusCode).toBe(200);
    });

    test('Check if use is active', async () => {
        const user = localStorage.get('dbUser');
        expect(user).toBeTruthy();

        const dbUser = await User.findUserById(user._id);
        expect(dbUser).toBeTruthy();
        expect(dbUser.active).toBeTruthy();
    });
});

describe('Sign in process', () => {
    test('Sign in by user name', async () => {
        const user = localStorage.get('user');

        const credentials = {
            userName: user.userName,
            password: user.password
        };

        const options = {
            method: 'POST',
            url: '/login',
            payload: JSON.stringify(credentials)
        };

        // Make request
        const response = await server.inject(options);
        const result = JSON.parse(JSON.stringify(response.result));

        expect(response.statusCode).toBe(200);
        expect(result['accessToken']).toBeDefined();
        expect(result['refreshToken']).toBeDefined();
    });

    test('Sign in by email', async () => {
        const user = localStorage.get('user');

        const credentials = {
            userName: user.email,
            password: user.password
        };

        const options = {
            method: 'POST',
            url: '/login',
            payload: JSON.stringify(credentials)
        };

        // Make request
        const response = await server.inject(options);
        const result = JSON.parse(JSON.stringify(response.result));

        expect(response.statusCode).toBe(200);
        expect(result['accessToken']).toBeDefined();
        expect(result['refreshToken']).toBeDefined();
    });
});


describe('Clear state after tests', () => {

    test('Clear DB', async () => {
        // Check if the user still exists into cache
        const user = localStorage.get('dbUser');
        expect(user).toBeTruthy();

        // Check if the user still exists into DB
        const dbUser = await User.findUserById(user._id);
        expect(dbUser).toBeTruthy();

        // Remove this user and return removed object
        const removedUser = await User.removeUserById(user._id);
        expect(removedUser).toBeTruthy();

        // Check if the user is completely removed from DB
        const nonExistentUser = await User.findUserById(user._id);
        expect(nonExistentUser).toBeFalsy();
    });


    test('Clear cache', () => {
        // Clear localStorage
        localStorage.clear();
        expect(localStorage.size).toEqual(0);
    });
});
'use strict';

const { server, launch } = require('../../server.js'); // Import Server/Application
const Mongoose = require('mongoose');

// Import DB models
const { User, PendingUser } = require('../../models');

// Create temp local sate for saving data
const localState = new Map();

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

    test('Check if localState for user is empty', () => {
        expect(localState.size).toEqual(0);
    });

    test('Should create new user(MAP js) into localState', () => {
        const user = {
            userName: 'TestUser1',
            email: 'limoto19@gmail.com',
            password: 'TempPass123!'
        };

        // Save user credential to local stare
        localState.set('user', user);

        expect(localState.has('user')).toEqual(true);
        expect(localState.size).toEqual(1);
    });

    test('Sign up user request', async () => {
        const user = localState.get('user');

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
        const { userName } = localState.get('user');

        const user = await User.fetchUserByNameOrEmail(userName);

        // Add user from DB to cache
        localState.set('dbUser', user);

        expect(user).toBeTruthy();
    });
});


describe('Activate user', () => {

    test('Check if user is not active', () => {
        const user = localState.get('dbUser');
        expect(user.active).toBeFalsy();
    });

    test('Activate user', async () => {
        const user = localState.get('dbUser');

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
        const user = localState.get('dbUser');
        expect(user).toBeTruthy();

        const dbUser = await User.findUserById(user._id);
        expect(dbUser).toBeTruthy();
        expect(dbUser.active).toBeTruthy();
    });
});


describe('Sign in process', () => {
    test('Sign in by user name', async () => {
        const { userName, password } = localState.get('user');
        const credentials = { userName,  password };

        const options = {
            method: 'POST',
            url: '/login',
            payload: JSON.stringify(credentials)
        };

        // Make request
        const response = await server.inject(options);
        expect(response.statusCode).toBe(200);

        const result = response.result;
        const accessToken = result['accessToken'];
        const refreshToken = result['refreshToken'];

        expect(accessToken).toBeDefined();
        expect(refreshToken).toBeDefined();

        // Save tokens to DB
        localState.set('accessToken', accessToken);
        localState.set('refreshToken', refreshToken);
    });

    test('Sign in by email', async () => {
        const { email, password } = localState.get('user');
        const credentials = {
            userName: email,
            password: password
        };

        const options = {
            method: 'POST',
            url: '/login',
            payload: JSON.stringify(credentials)
        };

        // Make request
        const response = await server.inject(options);
        expect(response.statusCode).toBe(200);

        const result = response.result;
        const accessToken = result['accessToken'];
        const refreshToken = result['refreshToken'];

        expect(accessToken).toBeDefined();
        expect(refreshToken).toBeDefined();

        // Save tokens to DB
        localState.set('accessToken', accessToken);
        localState.set('refreshToken', refreshToken);
    });
});


describe('Check auth permission', () => {
    test('Check valid JWT token', async () => {
        const accessToken = localState.get('accessToken');

        const options = {
            method: 'GET',
            url: '/token-test',
            headers: {
                Authorization: accessToken
            }
        };

        // Make request
        const response = await server.inject(options);

        expect(response.statusCode).toBe(204);
    });

    test('Check invalid JWT token', async () => {
        const options = {
            method: 'GET',
            url: '/token-test',
            headers: {
                Authorization: ''
            }
        };

        // Make request
        const response = await server.inject(options);

        expect(response.statusCode).toBe(401);
    });
});


describe('Clear state after tests', () => {

    test('Clear DB', async () => {
        // Check if the user still exists into cache
        const user = localState.get('dbUser');
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
        // Clear localState
        localState.clear();
        expect(localState.size).toEqual(0);
    });
});
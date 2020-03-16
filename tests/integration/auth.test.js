'use strict';

const { server, launch } = require('../../server.js'); // Import Server/Application
const Mongoose = require('mongoose');
const Services = require('../services');

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
        const user = Services.createFakeUserCredentials();

        // Save user credential to local stare
        localState.set('user', user);

        expect(localState.has('user')).toEqual(true);
        expect(localState.size).toEqual(1);
    });

    test('Sign up user request', async () => {
        const user = localState.get('user');
        const requestSignUpOptions = Services.createSignUpRequestOptions(user);

        // Make request
        const response = await server.inject(requestSignUpOptions);

        expect(response.statusCode).toBe(204);
    });

    test('Check if user is saved into DB', async () => {
        const { userName } = localState.get('user');

        const user = await User.fetchUserByNameOrEmail(userName);

        // Add user from DB to cache
        localState.set('dbUser', user);

        expect(user).toBeTruthy();
    });

    test('Sign up user request with the same credentials', async () => {
        const user = localState.get('user');
        const requestSignUpOptions = Services.createSignUpRequestOptions(user);

        // Make request
        const response = await server.inject(requestSignUpOptions);

        expect(response.statusCode).toBe(400);
    });
});


describe('Activate user', () => {

    test('Check if user is not activated', () => {
        const user = localState.get('dbUser');
        expect(user.active).toBeFalsy();
    });

    test('Try to sign in when user is not activated', async () => {
        const { userName, password } = localState.get('user');
        const options = Services.createSignInRequestOptions({ userName,  password });

        // Make request
        const response = await server.inject(options);
        expect(response.statusCode).toBe(302);
    });

    test('Activate user', async () => {
        const user = localState.get('dbUser');

        const pendingUser = await PendingUser.fetchOne({ userId: user._id });
        expect(pendingUser).toBeTruthy();

        const { activateCode } = pendingUser;
        expect(activateCode).toBeTruthy();

        const requestOptions = Services.createActivateUserRequestOptions(activateCode);

        // Make request
        const response = await server.inject(requestOptions);
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
        const options = Services.createSignInRequestOptions({ userName,  password });

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

        const options = Services.createSignInRequestOptions(credentials);

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
        const options = Services.createTestTokenRequestOptions(accessToken);

        // Make request
        const response = await server.inject(options);

        expect(response.statusCode).toBe(204);
    });

    test('Check invalid JWT token', async () => {
        const options = Services.createTestTokenRequestOptions();

        // Make request
        const response = await server.inject(options);

        expect(response.statusCode).toBe(401);
    });
});

describe('Forgot password process', () => {
    test('init Forgot Password Phrase', async () => {
        const { email } = localState.get('dbUser');
        const options = Services.initForgotPasswordPhrase(email);

        // Make request
        const response = await server.inject(options);
        expect(response.statusCode).toBe(204);
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
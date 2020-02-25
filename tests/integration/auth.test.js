'use strict';

const { server, launch } = require('../../server.js'); // Import Server/Application
const Mongoose = require('mongoose');
const _ = require('lodash');

const { User } = require('../../models');

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


describe('Create new user into DB', () => {


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

    test('Sign up user', async () => {
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

        const dbUser = await User.fetchUserByNameOrEmail(user.userName);
        localStorage.set('dbUser', dbUser);

        expect(dbUser).toBeTruthy();
    });
});

describe('Clear state after adding new user', () => {
    test('Clear DB', async () => {
        const user = localStorage.get('dbUser');

        const dbUser = await User.findUserById(user._id);
        expect(dbUser).toBeTruthy();


        const removedUser = await User.removeUserById(user._id);
        expect(removedUser).toBeTruthy();


        const removedUser1 = await User.findUserById(user._id);
        expect(removedUser1).toBeFalsy();
    });


    test('Clear localStorage', () => {
        localStorage.clear();

        expect(localStorage.size).toEqual(0);
    });
});

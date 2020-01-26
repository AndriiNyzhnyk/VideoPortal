'use strict';

const { server, launch } = require('../../server.js'); // Import Server/Application
const Mongoose = require('mongoose');

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
    await server.stop({ timeout: 0 });
});


describe('Test server.js', () => {
    test('should success with server connection', async  () => {
        const options = {
            method: 'GET',
            url: '/'
        };
        const response = await server.inject(options);
        expect(response.statusCode).toBe(200);
    });
});


describe('Test server methods', () => {

    test('Should encrypt and decrypt any text', async  () => {
        const { encrypt, decrypt } = server.methods;
        const inputText = 'Test test test 123';

        const encryptedText = await encrypt(inputText);

        const decryptedText = await decrypt(encryptedText);

        expect(decryptedText).toBe(inputText);
    });
});
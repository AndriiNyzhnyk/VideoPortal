'use strict';

const Path = require('path');
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
    await server.stop();
});

describe('Test serverMethods', () => {
    test('Should return path to uploaded movie with valid arguments', async  () => {
        const { createPathToMovie } = server.methods;
        const expectedPath = Path.join(__dirname, '../../uploads/movies/', 'it.mp4');
        const createdPath = await createPathToMovie('it.mp4');

        expect(createdPath).toMatch(`${expectedPath}`);
    });

    test('Should return path to uploaded movie with no valid arguments "empty string"', async  () => {
        const { createPathToMovie } = server.methods;

        return expect(createPathToMovie('   ')).rejects.toMatch('Bad argument')
    });

    test('Should return path to uploaded movie with no valid arguments "number instead of string"', async  () => {
        const { createPathToMovie } = server.methods;

        return expect(createPathToMovie(15)).rejects.toMatch('Bad argument')
    });

    test('Should escaped and validated user inputs such as query/path parameters(save from XSS) for string', async  () => {
        const { securityParamsFilter } = server.methods;
        const evilString = '<html> hey </html>';
        const expectedString = '&lt;html&gt; hey &lt;&#x2f;html&gt;';

        const result = await securityParamsFilter(evilString, true);

        expect(result).toMatch(expectedString);
    });

    test('Should escaped and validated user inputs such as query/path parameters(save from XSS) for object', async  () => {
        const { securityParamsFilter } = server.methods;
        const evilObject = {value: '<html> hey </html>'};
        const expectedObject = { value: "&lt;html&gt; hey &lt;&#x2f;html&gt;" };
        const result = await securityParamsFilter(evilObject, false);

        expect(result).toEqual(expectedObject);
    });
});
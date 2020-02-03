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


    describe('Should escaped and validated user inputs such as query/path parameters(save from XSS) for string', () => {
        test('Correct string', async  () => {
            const { securityParamsFilter } = server.methods;
            const evilString = '<html> hey </html>';
            const expectedString = '&lt;html&gt; hey &lt;&#x2f;html&gt;';

            const result = await securityParamsFilter(evilString, true);

            expect(result).toMatch(expectedString);
        });

        test('Object instead of string', async  () => {
            const { securityParamsFilter } = server.methods;
            return expect(securityParamsFilter({}, true)).rejects.toMatch('Argument must be a string');
        });

        test('Array instead of string', async  () => {
            const { securityParamsFilter } = server.methods;
            return expect(securityParamsFilter([], true)).rejects.toMatch('Argument must be a string');
        });

        test('Number instead of string', async  () => {
            const { securityParamsFilter } = server.methods;
            return expect(securityParamsFilter(1, true)).rejects.toMatch('Argument must be a string');
        });

        test('Null instead of string', async  () => {
            const { securityParamsFilter } = server.methods;
            return expect(securityParamsFilter(null, true)).rejects.toMatch('Argument must be a string');
        });

        test('Undefined instead of string', async  () => {
            const { securityParamsFilter } = server.methods;
            return expect(securityParamsFilter(undefined, true)).rejects.toMatch('Argument must be a string');
        });
    });



    describe('Should escaped and validated user inputs such as query/path parameters(save from XSS) for object', () => {
        test('Correct object', async  () => {
            const { securityParamsFilter } = server.methods;
            const evilObject = {value: '<html> hey </html>'};
            const expectedObject = { value: "&lt;html&gt; hey &lt;&#x2f;html&gt;" };
            const result = await securityParamsFilter(evilObject, false);

            expect(result).toEqual(expectedObject);
        });

        test('String instead of object', async  () => {
            const { securityParamsFilter } = server.methods;
            return expect(securityParamsFilter('text', false)).rejects.toMatch('Argument must be an object');
        });

        test('Array instead of object', async  () => {
            const { securityParamsFilter } = server.methods;
            return expect(securityParamsFilter([], false)).rejects.toMatch('Argument must be an object');
        });

        test('Number instead of object', async  () => {
            const { securityParamsFilter } = server.methods;
            return expect(securityParamsFilter(100, false)).rejects.toMatch('Argument must be an object');
        });

        test('Null instead of object', async  () => {
            const { securityParamsFilter } = server.methods;
            return expect(securityParamsFilter(null, false)).rejects.toMatch('Argument must be an object');
        });

        test('Undefined instead of object', async  () => {
            const { securityParamsFilter } = server.methods;
            return expect(securityParamsFilter(undefined, false)).rejects.toMatch('Argument must be an object');
        });
    });
});
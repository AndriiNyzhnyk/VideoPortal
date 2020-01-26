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
    await server.stop({ timeout: 60 * 1000 });
});

test('should success with server connection', async  () => {
    const options = {
        method: 'GET',
        url: '/'
    };
    const response = await server.inject(options);
    expect(response.statusCode).toBe(200);
});
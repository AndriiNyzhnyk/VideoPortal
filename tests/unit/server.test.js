const server = require('../../server.js'); // Import Server/Application

module.exports = {
    testEnvironment: 'node'
};

// Start application before running the test case
beforeAll((done) => {
    server.events.on('start', () => {
        done();
    });
});

// Stop application after running the test case
afterAll((done) => {
    server.events.on('stop', () => {
        done();
    });

    server.stop();
});

test('should success with server connection', async function () {
    const options = {
        method: 'GET',
        url: '/'
    };
    const response = await server.inject(options);
    expect(response.statusCode).toBe(200);
});
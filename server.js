'use strict';

require('dotenv').config({path: `${__dirname}/.env`});

// Internal Node.js modules
const FS = require('fs');
const Http2 = require('http2');
const Path = require('path');
const Os = require('os');


// Hapi.js modules
const Hapi = require('@hapi/hapi');
const Vision = require('@hapi/vision');
const Inert = require('@hapi/inert');


// Third party dependencies
const Handlebars = require('handlebars');
const Jwt2 = require('hapi-auth-jwt2');
const Brok = require('brok');


// Get process environments
const { HTTP_PORT, HTTP_HOST, JWT2_PLUGIN_KEY } = process.env;


// Custom dependencies
const utils = require('./utils');
const cpuNums = Os.cpus().length;
const routes = require('./api/router');
const createConnectionToDB = require('./db');


// Tuning the UV_THREADPOOL_SIZE
process.env.UV_THREADPOOL_SIZE = cpuNums;

// read certificate and private key
const serverOptions = {
    key: FS.readFileSync(Path.resolve(__dirname, 'certs/myKey.key')),
    cert: FS.readFileSync(Path.resolve(__dirname, 'certs/myCertificate.crt')),
    allowHTTP1: true
};

// Create http2 secure server listener
const listener = Http2.createSecureServer(serverOptions);

// Settings web server
const server = Hapi.server({
    port: HTTP_PORT,
    host: HTTP_HOST,
    tls: true,
    listener,
    routes: {
        files: {
            relativeTo: Path.join(__dirname, 'public')
        }
    }
});

const launch = async () => {
    // Register all server methods
    require('./serverMethods')(server);

    // Register plugins
    await server.register(Jwt2);
    await server.register(Vision);
    await server.register(Inert);
    await server.register({
        plugin: Brok,
        options: {
            compress: { quality: 3 }
        }
    });

    // Setting default auth strategy
    server.auth.strategy('jwt', 'jwt', {
        key: JWT2_PLUGIN_KEY,
        validate: utils.validate,
        verifyOptions: { algorithms: ['HS256'] }
    });
    server.auth.default('jwt');

    // Set templates engine
    server.views({
        engines: {
            hbs: Handlebars
        },
        relativeTo: __dirname,
        path: 'templates',
        layoutPath: './templates/layout',
        helpersPath: './templates/helpers',
        partialsPath: './templates/partials'
    });

    // Attach all routes
    server.route(routes);

    // Set connection with DB
    const db = await createConnectionToDB();

    // Start server
    await server.start();

    // Place for log some info
    if (require.main === module) {
        console.log(`Mongoose connected - ${db.connection.host}:${db.connection.port}`);
    }

    return server;
};

process.on('unhandledRejection', (err) => {
    console.log(err);
    process.exit(1);
});


/*
* When a file is run directly from Node.js, require.main is set to its module.
* That means that it is possible to determine whether a file has been run directly by testing require.main === module.
* For a file foo.js, this will be true if run via node foo.js, but false if run by require('./foo').
* Because module provides a filename property (normally equivalent to __filename), the entry point of the current
* application can be obtained by checking require.main.filename.
* */
if (require.main === module) {
    launch()
        .then((server) => {
            console.log('Server running on %s', server.info.uri);
        })
        .catch((err) => {
            console.log(err);
        });
} else {
    // launch();

    module.exports = {server, launch };
}
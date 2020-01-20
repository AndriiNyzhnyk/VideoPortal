'use strict';

require('dotenv').config({path: `${__dirname}/.env`});

const Hapi = require('@hapi/hapi');
const FS = require('fs');
const Http2 = require('http2');
const Path = require('path');
const Vision = require('@hapi/vision');
const Handlebars = require('handlebars');
const Inert = require('@hapi/inert');
const Jwt2 = require('hapi-auth-jwt2');
const Qs = require('qs');
const {HTTP_PORT, HTTP_HOST} = process.env;

const credentials = require('./credentials');
const utils = require('./utils');
const cpuNums = require('os').cpus().length;
const routes = require('./api/router');

// tuning the UV_THREADPOOL_SIZE
process.env.UV_THREADPOOL_SIZE = cpuNums;

// Set connection with DB
require('./db')();

// read certificate and private key
const serverOptions = {
    key: FS.readFileSync(Path.resolve(__dirname, 'certs/myKey.key')),
    cert: FS.readFileSync(Path.resolve(__dirname, 'certs/myCertificate.crt')),
    allowHTTP1: true
};

// create http2 secure server listener
const listener = Http2.createSecureServer(serverOptions);

const launch = async () => {

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
        },
        query: {
            parser: (query) => Qs.parse(query)
        }
    });

    // Register all server methods
    require('./serverMethods')(server);

    // Register plugins
    await server.register(Jwt2);
    await server.register(Vision);
    await server.register(Inert);

    // Setting default auth strategy
    server.auth.strategy('jwt', 'jwt', {
        key: credentials.jwt2.key,
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

    // Start server
    await server.start();
    console.log('Server running on %s', server.info.uri);
};

process.on('unhandledRejection', (err) => {
    console.log(err);
    process.exit(1);
});

launch();
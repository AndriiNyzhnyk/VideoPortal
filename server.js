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
const Mongoose = require('mongoose');
const credentials = require('./credentials');
const serverMethods = require('./serverMethods');
const func = require('./functions');
const cpuNums = require('os').cpus().length;

// tuning the UV_THREADPOOL_SIZE
process.env.UV_THREADPOOL_SIZE = cpuNums;
const {DB_URL, DB_NAME, HTTP_PORT, HTTP_HOST} = process.env;

// Set connection with DB
Mongoose.connect(`${DB_URL}/${DB_NAME}`, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    useFindAndModify: false
});

// Register error handler for DB connection
const DB = Mongoose.connection;
DB.on('error', (err) => {
    console.error(err);
    console.error('connection error');
});

DB.once('open', () => {
    console.log(`We're connected to DB`)
});

const routes = require('./api/router');

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
        }
    });

    // Register all server methods
    server.method(serverMethods);

    // Register plugins
    await server.register(Jwt2);
    await server.register(Vision);
    await server.register(Inert);

    // Setting default auth strategy
    server.auth.strategy('jwt', 'jwt', {
        key: credentials.jwt2.key,
        validate: func.validate,
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
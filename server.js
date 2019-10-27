'use strict';

const Hapi = require('@hapi/hapi');
const FS = require('fs');
const Http2 = require('http2');
const Path = require('path');
const Vision = require('@hapi/vision');
const Handlebars = require('handlebars');
const Inert = require('@hapi/inert');
const Mongoose = require('mongoose');
const credentials = require('./credentials');
const serverMethods = require('./serverMethods');
const func = require('./functions');

// Set connection with DB
Mongoose.connect('mongodb://localhost:27017/video-portal', {
    useNewUrlParser: true,
    useUnifiedTopology: true
});

const DB = Mongoose.connection;
DB.on('error', console.error.bind(console, 'connection error:'));
DB.once('open', function() {
    console.log('We\'re connected to DB')
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

const init = async () => {

    const server = Hapi.server({
        port: 3000,
        host: 'localhost',
        tls: true,
        listener,
        routes: {
            files: {
                relativeTo: Path.join(__dirname, 'public')
            }
        }
    });

    server.method(serverMethods);

    // Register plugins
    await server.register(require('hapi-auth-jwt2'));
    await server.register(Vision);
    await server.register(Inert);

    server.auth.strategy('jwt', 'jwt', {
        key: credentials.jwt2,
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

    server.route(routes);

    await server.start();
    console.log('Server running on %s', server.info.uri);
};

process.on('unhandledRejection', (err) => {
    console.log(err);
    process.exit(1);
});

init();
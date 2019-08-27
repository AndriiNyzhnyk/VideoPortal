'use strict';

const Hapi = require('@hapi/hapi');
const FS = require('fs');
const Http2 = require('http2');
const Path = require('path');
const Vision = require('@hapi/vision');
const Handlebars = require('handlebars');
const Inert = require('@hapi/inert');
const Mongoose = require('mongoose');

// Set connection with DB
Mongoose.connect('mongodb://localhost:27017/video-portal', {
    useNewUrlParser: true
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

    // Register plugins
    await server.register(Vision);
    await server.register(Inert);

    // Set views engine
    server.views({
        engines: { html: Handlebars },
        relativeTo: __dirname,
        path: 'views'
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
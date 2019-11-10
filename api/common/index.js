'use strict';

module.exports = [
    {
        method: 'GET',
        path: '/',
        handler: (req, h) => {
            return h.view('home', {});
        },
        options: { auth: false },
    },
    {
        method: 'GET',
        path: '/movie',
        handler: (req, h) => {
            return h.view('moviePage', {});
        },
        options: { auth: false },
    },
    {
        method: 'GET',
        path: '/test-video',
        handler: (req, h) => {
            return h.file('TestStream.html');
        },
        options: { auth: false },
    },
    {
        method: 'GET',
        path: '/test-file-upload',
        handler: (req, h) => {
            return h.file('fileUpload.html');
        },
        options: { auth: false },
    },
    {
        method: 'GET',
        path: '/{param*}',
        handler: {
            directory: {
                path: '.',
                redirectToSlash: true
            }
        },
        options: { auth: false },
    }
];
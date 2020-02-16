'use strict';

module.exports = [
    {
        method: 'GET',
        path: '/',
        handler: (req, h) => {
            return h.view('home', {});
        },
        options: { auth: false }
    },
    {
        method: 'GET',
        path: '/token-test',
        handler: (req, h) => {

            console.log(req.info);
            return 'Well Done';
        },
        options: { auth: 'jwt' }
    },
    {
        method: 'GET',
        path: '/test-video',
        handler: (req, h) => {
            return h.file('TestStream.html');
        },
        options: { auth: false }
    },
    {
        method: 'GET',
        path: '/test-file-upload',
        handler: (req, h) => {
            return h.file('fileUpload.html');
        },
        options: { auth: false }
    },
    {
        method: 'GET',
        path: '/static/{param*}',
        handler: {
            directory: {
                path: '.',
                redirectToSlash: true
            }
        },
        options: { auth: false }
    },
    {
        method: '*',
        path: '/{any*}',
        handler: function (request, h) {
            return h.view('page404', {});
        },
        options: { auth: false }
    }
];
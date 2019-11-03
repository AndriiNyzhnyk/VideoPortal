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
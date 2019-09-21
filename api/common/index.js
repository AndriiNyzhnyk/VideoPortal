'use strict';

module.exports = [
    {
        method: 'GET',
        path: '/',
        handler: (req, h) => {
            return 'Hello World!';
        },
        options: { auth: 'jwt' },
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
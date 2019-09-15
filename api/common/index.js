'use strict';

module.exports = [
    {
        method: 'GET',
        path: '/',
        config: { auth: false },
        handler: (req, h) => {
            return 'Hello World!';
        }
    },
    {
        method: 'GET',
        path: '/{param*}',
        config: { auth: false },
        handler: {
            directory: {
                path: '.',
                redirectToSlash: true
            }
        }
    }
];
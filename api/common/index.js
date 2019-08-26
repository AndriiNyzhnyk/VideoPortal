'use strict';

module.exports = [
    {
        method: 'GET',
        path: '/',
        handler: (req, h) => {
            return 'Hello World!';
        }
    },
    {
        method: 'GET',
        path: '/{param*}',
        handler: {
            directory: {
                path: '.',
                redirectToSlash: true
            }
        }
    }
];
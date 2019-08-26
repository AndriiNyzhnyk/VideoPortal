'use strict';

module.exports = [
    {
        method: 'GET',
        path: '/sign-up-form',
        handler: (req, h) => {
            return h.view('signUp', {
                title: 'examples/handlebars/templates/basic | hapi ' + req.server.version,
                message: 'Hello Handlebars!'
            });
        }
    }
];
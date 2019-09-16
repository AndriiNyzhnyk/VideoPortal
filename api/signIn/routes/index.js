'use strict';

const controllers = require('../controllers/signIn');

module.exports = [
    {
        method: 'GET',
        path: '/sign-in',
        config: { auth: false },
        handler: controllers.signIn
    },
    {
        method: 'POST',
        path: '/login',
        config: { auth: false },
        handler: controllers.login
    },
    {
        method: 'GET',
        path: '/test',
        config: {auth: 'jwt'},
        handler: controllers.signIn
    },
];
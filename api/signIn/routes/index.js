'use strict';

const controllers = require('../controllers/signIn');

module.exports = [
    {
        method: 'GET',
        path: '/sign-in',
        handler: controllers.signIn
    },
];
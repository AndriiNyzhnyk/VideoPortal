'use strict';

const controllers = require('../controllers/forgotPass');

const self = module.exports = [
    {
        method: 'GET',
        path: '/forgot-pass',
        config: { auth: false },
        handler: controllers.getPage
    },
];
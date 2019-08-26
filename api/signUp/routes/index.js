'use strict';

const controllers = require('../controllers');

module.exports = [
    {
        method: 'GET',
        path: '/sign-up-form',
        handler: controllers.getSignUpPage
    },
    {
        method: 'POST',
        path: '/registration',
        handler: controllers.registration
    }

];
'use strict';

const controllers = require('../controllers/videoStream');

module.exports = [
    {
        method: 'GET',
        path: '/movie/{name}',
        handler: controllers.watchMovie,
        options: { auth: false }
    },
    // {
    //     method: 'POST',
    //     path: '/',
    //     handler: '',
    //     options: {auth: false}
    // },
];
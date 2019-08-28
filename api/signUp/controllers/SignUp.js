'use strict';
const User = require('../../../models/User');

module.exports = {
    getSignUpPage: async (req, h) => {
        return h.view('signUp', {
            title: 'examples/handlebars/templates/basic | hapi ' + req.server.version,
            message: 'Hello Handlebars!'
        });
    },

    registration: async (req, h) => {
        let user = await User.create({
            name: req.payload.userName,
            email: req.payload.email,
            password: req.payload.password
        });

        return user;
    }
};
'use strict';

module.exports = {
    getSignUpPage: async (req, h) => {
        return h.view('signUp', {
            title: 'examples/handlebars/templates/basic | hapi ' + req.server.version,
            message: 'Hello Handlebars!'
        });
    },

    registration: async (req, h) => {
        const name = req.payload.userName;
        const email = req.payload.email;
        const password = req.payload.password;

        console.log(name, email, password);

        return 'OK';
    }
};
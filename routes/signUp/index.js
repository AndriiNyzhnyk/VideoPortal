module.exports = [
    {
        method: 'GET',
        path: '/sign-up-form',
        handler: (request, h) => {
            return h.view('signUp', {
                title: 'examples/handlebars/templates/basic | hapi ' + request.server.version,
                message: 'Hello Handlebars!'
            });
        }
    }
];
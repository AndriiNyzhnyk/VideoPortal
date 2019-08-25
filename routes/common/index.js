module.exports = [
    {
        method: 'GET',
        path: '/',
        handler: (request, h) => {
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
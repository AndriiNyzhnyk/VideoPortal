'use strict';

const Register = require('prom-client').register;
const Amqp = require('../../modules/AMQP');

module.exports = [
    {
        method: 'GET',
        path: '/monitoring',
        handler: async (req, h) => {
            const metrics = Register.metrics();
            const AmqpClient = await Amqp.getInstance();
            await AmqpClient.sendDataToServer('monitoring', metrics);

            return metrics;
        },
        options: { auth: false }
    },
    {
        method: 'GET',
        path: '/token-test',
        handler: (req, h) => {
            return h.response();
        },
        options: { auth: 'jwt' }
    },
    {
        method: 'GET',
        path: '/test-video',
        handler: (req, h) => {
            return h.file('TestStream.html');
        },
        options: { auth: false }
    },
    {
        method: 'GET',
        path: '/test-file-upload',
        handler: (req, h) => {
            return h.file('fileUpload.html');
        },
        options: { auth: false }
    },
    {
        method: 'GET',
        path: '/static/{param*}',
        handler: {
            directory: {
                path: '.',
                redirectToSlash: true
            }
        },
        options: { auth: false }
    },
    {
        method: '*',
        path: '/{any*}',
        handler: function (request, h) {
            return h.view('page404', {});
        },
        options: { auth: false }
    }
];
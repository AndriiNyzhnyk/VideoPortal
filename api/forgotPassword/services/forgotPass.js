'use strict';

const Crypto = require('crypto');
const Handlebars = require('handlebars');
const utils = require('../../../utils');

const self = module.exports = {
    sendEmailToUser: async (email) => {
        try {
            // Preparing params
            const url = 'https://localhost:8080/reset-password/';
            const verifyCode = self.generateVerifyCode();
            const link = url + verifyCode;

            // Generate template
            const template = self.createTemplate();
            const source = Handlebars.compile(template);
            const html = source({link});

            // Send Email
            const options = {
                email,
                subject: 'Reset Password',
                html
            };

            const [mailOptions, transporter] = await Promise.all([
                utils.createMailOptions(options),
                utils.getTransporter()
            ]);

            const result = await transporter.sendMail(mailOptions);

            return {result, verifyCode};
        } catch (e) {
            console.log(e);
        }
    },

    generateVerifyCode: () => {
        return Crypto.randomBytes(20).toString('hex');
    },

    createTemplate: () => {
        return "<p>To reset your password please follow the <a href={{link}}>link</a></p>";
    }
};
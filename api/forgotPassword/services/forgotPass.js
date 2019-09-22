'use strict';

const Crypto = require('crypto');
const Handlebars = require('handlebars');
const func = require('../../../functions');

const self = module.exports = {
    sendEmailToUser: async (email) => {
        try {
            // Preparing params
            const url = 'https://localhost:3000/reset-password/';
            const verifyCode = await self.generateVerifyCode();
            const link = url + verifyCode;

            // Generate template
            const template = await self.createTemplate();
            const source = Handlebars.compile(template);
            const html = await self.addDataToTemplate(source, {link});

            // Send Email
            const options = {
                email,
                subject: 'Reset Password',
                html
            };
            const mailOptions = await func.createMailOptions(options);
            const transporter = await func.getTransporter();
            const result = await transporter.sendMail(mailOptions);

            return {result, verifyCode};
        } catch (e) {
            console.log(e);
        }
    },

    generateVerifyCode: async () => {
        return new Promise((resolve) => {
            const code = Crypto.randomBytes(20).toString('hex');

            resolve(code);
        });
    },

    createTemplate: () => {
        return new Promise((resolve) => {
            let source = "<p>To reset your password please follow the <a href={{link}}>link</a></p>";

            resolve(source);
        });
    },

    addDataToTemplate: (source, data) => {
        return new Promise((resolve) => {

            resolve(source(data));
        });
    }
};
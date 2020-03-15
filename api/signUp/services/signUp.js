'use strict';

const { POSTMAN_EMAIL, POSTMAN_PASSWORD, HTTP_HOST, HTTP_PORT } = process.env;

const NodeMailer = require('nodemailer');
const emailTemplate = require('./emailTemplate');

const self = module.exports = {
    sendEmail: async (email, link) => {
        const html = await emailTemplate.init({'link': link});

        const transporter = NodeMailer.createTransport({
            service: 'gmail',
            auth: {
                user: POSTMAN_EMAIL,
                pass: POSTMAN_PASSWORD
            }
        });

        const mailOptions = {
            from: POSTMAN_EMAIL,
            to: email,
            subject: 'Activate User',
            html
        };

        const result = await transporter.sendMail(mailOptions);

        if (!result || !result.accepted.length || result.rejected.length) {
            return {error: true, result};
        }

        return {error: false, result};
    },

    generateLinkForActivateUser: (activateCode) => {
        return new Promise((resolve) => {
            resolve(`https://${HTTP_HOST}:${HTTP_PORT}/activate-user/${activateCode}`)
        });
    },
};
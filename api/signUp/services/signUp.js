'use strict';

const NodeMailer = require('nodemailer');
const credetials = require('../../../credentials').email;

module.exports = {
    sendEmail: async (text = 'Hello') => {
        try {
            const transporter = NodeMailer.createTransport({
                service: 'gmail',
                auth: {
                    user: credetials.user,
                    pass: credetials.pass
                }
            });

            const mailOptions = {
                from: credetials.user,
                to: credetials.pass,
                subject: 'Sending Email using Node.js',
                text: text
            };

            const result = await transporter.sendMail(mailOptions);
            console.log(result);
        } catch (e) {
            console.log(e);
        }
    }
};
'use strict';

const NodeMailer = require('nodemailer');
const credetials = require('../../../credentials').email;
const emailTemplate = require('./emailTemplate');


const self = module.exports = {
    sendEmail: async (email, link) => {
        try {
            const html = await emailTemplate.init({'link': link});

            const transporter = NodeMailer.createTransport({
                service: 'gmail',
                auth: {
                    user: credetials.user,
                    pass: credetials.pass
                }
            });

            const mailOptions = {
                from: credetials.user,
                to: email,
                subject: 'Activate User',
                html
            };

            const result = await transporter.sendMail(mailOptions);

            if (!result || !result.accepted.length || result.rejected.length) {
                return {error: true, result};
            }

            return {error: false, result};
        } catch (e) {
            console.log(e);
        }
    }
};
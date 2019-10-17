'use strict';

const Hoek = require('@hapi/hoek');
const NodeMailer = require('nodemailer');
const credetials = require('./credentials').email;

const self = module.exports = {
    validate: async (decoded, req) => {
        console.log(decoded, req);
        let user = await User.findOne({ _id: decoded.id });
        if (user) {
            req.user = user;
            return { isValid: true };
        } else {
            return { isValid: false };
        }
    },

    securityParamsFilter: (input, primitive = true) => {
        return new Promise( (resolve) => {
            if (primitive) {
                const result = Hoek.escapeHtml(input);
                resolve(result);
            } else {
                let result = Object.create(null);

                for (let key in input) {
                    result[key] = Hoek.escapeHtml(input[key]);
                }

                resolve(result);
            }
        })
    },

    getTransporter: async (service = 'gmail') => {
        return new Promise((resolve) => {
            const transporter = NodeMailer.createTransport({
                service,
                auth: {
                    user: credetials.user,
                    pass: credetials.pass
                }
            });

            resolve(transporter);
        });
    },

    createMailOptions: async (options) => {
        return new Promise((resolve) => {
            const {email, subject, html} = options;

            const mailOptions = {
                from: credetials.user,
                to: email,
                subject,
                html
            };

            resolve(mailOptions);
        });
    }
};
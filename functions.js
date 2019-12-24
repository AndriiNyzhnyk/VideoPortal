'use strict';

const Hoek = require('@hapi/hoek');
const NodeMailer = require('nodemailer');
const credetials = require('./credentials').email;
const User = require('./models/User');
const _ = require('lodash');

const self = module.exports = {
    validate: async (decoded, req, h) => {
        const SM = req.server.methods;

        const decryptedUserId = await SM.decrypt(decoded.userId);
        const user = await User.findOne({ _id: decryptedUserId });

        if(!user || decoded.type !== 'access') {
            return { isValid: false };
        }

        const encodedRefreshTokenData = user.token.split('.')[1];
        const refreshTokenData = JSON.parse(Buffer.from(encodedRefreshTokenData, "base64"));

        if (refreshTokenData.tokenId !== decoded.tokenId) {
            return { isValid: false };
        }


        req.info.userClient = _.omit(user._doc, ['password', 'token', '__v']);
        return { isValid: true };
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
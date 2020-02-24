'use strict';

const NodeMailer = require('nodemailer');
const { email: emailCredetials}  = require('./credentials');
const { User } = require('./models');
const _ = require('lodash');

const self = module.exports = {
    /**
     * Validation function for 'hapi-auth-jwt2' plugin.
     * @param {Object} decoded
     * @param {Object} req
     * @param {Object} h
     * @returns {Promise<{isValid: boolean}>}
     */
    validate: async (decoded, req, h) => {
        const SM = req.server.methods;

        const decryptedUserId = await SM.decrypt(decoded.userId);
        const user = await User.findUserById(decryptedUserId );

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

    /**
     * Create transporter for sending email
     * @param {String} service
     * @returns {Promise<*>}
     */
    getTransporter: (service = 'gmail') => {
        return new Promise((resolve) => {
            const transporter = NodeMailer.createTransport({
                service,
                auth: {
                    user: emailCredetials.user,
                    pass: emailCredetials.pass
                }
            });

            resolve(transporter);
        });
    },

    /**
     * Create mail config
     * @param {Object} options
     * @returns {Promise<Object>}
     */
    createMailOptions: (options) => {
        return new Promise((resolve) => {
            const {email, subject, html} = options;

            const mailOptions = {
                from: emailCredetials.user,
                to: email,
                subject,
                html
            };

            resolve(mailOptions);
        });
    }
};
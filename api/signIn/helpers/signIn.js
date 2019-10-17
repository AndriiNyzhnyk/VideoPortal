'use strict';

const Hoek = require('@hapi/hoek');
const Crypto = require('crypto');
const User = require('../../../models/User');

const self = module.exports = {
    // Checking the password hash
    verifyPassword: (password, original) => {
        return new Promise((resolve) => {
            const salt = original.split('$')[0];
            const originalHash = original.split('$')[1];
            const hash = Crypto.pbkdf2Sync(password, salt, 2048, 32, 'sha512').toString('hex');

            resolve( hash === originalHash);
        });
    },

    findUser: async (userName) => {
        const nameOrEmail = Hoek.escapeHtml(userName);

        const user = await User.findOne({
            $or: [
                {
                    name: nameOrEmail
                },
                {
                    email: nameOrEmail
                }
            ]
        });

        return user;
    }
};
'use strict';

const Crypto = require('crypto');

const self = module.exports = {
    // Checking the password hash
    verifyPassword: (password, original) => {
        return new Promise((resolve) => {
            const salt = original.split('$')[0];
            const originalHash = original.split('$')[1];
            const hash = Crypto.pbkdf2Sync(password, salt, 2048, 32, 'sha512').toString('hex');

            resolve( hash === originalHash);
        });
    }
};
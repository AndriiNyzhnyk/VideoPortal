'use strict';

const Crypto = require('crypto');

const self = module.exports = {
    // Create password hash using Password based key
    hashPassword: (password) => {
        return new Promise((resolve) => {
            const salt = Crypto.randomBytes(32).toString('hex');
            const hash = Crypto.pbkdf2Sync(password, salt, 2048, 32, 'sha512').toString('hex');
            resolve( [salt, hash].join('$') );
        });

    },

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
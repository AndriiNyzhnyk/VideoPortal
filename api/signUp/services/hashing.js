'use strict';

const Crypto = require('crypto');
const {promisify: Promisify} = require('util');
const createHash = Promisify(Crypto.pbkdf2);

const iterations = 2048;
const keyLen = 32;
const digest = 'sha512';

const self = module.exports = {
    // Create password hash using Password based key
    hashPassword: async (password) => {
        const salt = Crypto.randomBytes(32).toString('hex');
        const hash = (await createHash(password, salt, iterations, keyLen, digest)).toString('hex');
        return [salt, hash].join('$');
    },

    // Checking the password hash
    verifyPassword: async (password, original) => {
        const [salt, originalHash] = original.split('$');
        const hash = (await createHash(password, salt, iterations, keyLen, digest)).toString('hex');

        return (hash === originalHash);
    }
};
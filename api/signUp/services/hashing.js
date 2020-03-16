'use strict';

const Crypto = require('crypto');
const {promisify: Promisify} = require('util');
const createHash = Promisify(Crypto.pbkdf2);

const iterations = 2048;
const keyLen = 32;
const digest = 'sha512';

const self = module.exports = {
    /**
     * Create hash for password
     * @param {String} password
     * @returns {Promise<String>}
     */
    hashPassword: async (password) => {
        const salt = Crypto.randomBytes(32).toString('hex');
        const hash = await createHash(password, salt, iterations, keyLen, digest);
        return [salt, hash.toString('hex')].join('$');
    },

    /**
     * Checking the password hash
     * @param {String} password
     * @param {String} original
     * @returns {Promise<Boolean>}
     */
    verifyPassword: async (password, original) => {
        const [salt, originalHash] = original.split('$');
        const hash = await createHash(password, salt, iterations, keyLen, digest);

        return hash.toString('hex') === originalHash;
    }
};
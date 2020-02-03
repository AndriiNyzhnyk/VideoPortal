'use strict';

const Crypto = require('crypto');
const Path = require('path');
const Hoek = require('@hapi/hoek');

const credentials = require('./credentials').crypto;
const encryptDecryptAlgorithm = 'aes-256-cbc';

module.exports = (server) => {
    /**
     * Encrypt any text
     * @param {String} text Input text
     * @returns {Promise<String>}
     */
    const encrypt = (text) => {
        return new Promise( (resolve) => {
            const iv = Crypto.randomBytes(credentials.ivLength);
            let cipher = Crypto.createCipheriv(encryptDecryptAlgorithm, Buffer.from(credentials.encryptionKey), iv);
            let encrypted = cipher.update(text);

            encrypted = Buffer.concat([encrypted, cipher.final()]);
            const cryptoText = iv.toString('hex') + ':' + encrypted.toString('hex');

            resolve(cryptoText);
        });
    };
    server.method('encrypt', encrypt, {});


    /**
     * Decrypt any text
     * @param {String} text
     * @returns {Promise<String>}
     */
    const decrypt = (text) => {
        return new Promise( (resolve) => {
            const textParts = text.split(':');
            const iv = Buffer.from(textParts.shift(), 'hex');
            let encryptedText = Buffer.from(textParts.join(':'), 'hex');
            let decipher = Crypto.createDecipheriv(encryptDecryptAlgorithm, Buffer.from(credentials.encryptionKey), iv);
            let decrypted = decipher.update(encryptedText);

            decrypted = Buffer.concat([decrypted, decipher.final()]);

            resolve(decrypted.toString());
        });
    };
    server.method('decrypt', decrypt, {});


    /**
     * Check any params, escape HTML and other stuff. This is done to prevent echo or XSS attacks.
     * @param {String|| Object} input
     * @param {Boolean} primitive
     * @param {Boolean} strict
     * @returns {Promise<String || Object>}
     */
    const securityParamsFilter = (input, primitive = true, strict = true) => {
        return new Promise( (resolve, reject) => {
            if (primitive) {
                if (typeof input !== 'string') {
                    reject('Argument must be a string');
                }

                resolve( Hoek.escapeHtml(input) );
            } else {
                if (!input || typeof input !== 'object') {
                    reject('Argument must be an object');
                }

                let result = Object.create(null);

                for (let key in input) {
                    if (strict) {
                        if (input.hasOwnProperty(key) ) {
                            result[key] = Hoek.escapeHtml(input[key]);
                        }
                    } else {
                        result[key] = Hoek.escapeHtml(input[key]);
                    }
                }

                resolve(result);
            }
        });
    };
    server.method('securityParamsFilter', securityParamsFilter, {});


    /**
     * Create specific path to movie
     * @param {String} movieName
     * @returns {Promise<String>}
     */
    const createPathToMovie = (movieName) => {
        return new Promise( (resolve,reject) => {
            if (typeof movieName !== 'string' || movieName.trim() === '') {
                reject('Bad argument');
            }

            const path = Path.join(__dirname, './uploads/movies', movieName);
            resolve(path);
        });
    };
    server.method('createPathToMovie', createPathToMovie, {});
};
'use strict';

const crypto = require('crypto');
const Path = require('path');
const Hoek = require('@hapi/hoek');
const credentials = require('./credentials').crypto;

module.exports = (server) => {
    /**
     *
     * @param text
     * @returns {Promise<unknown>}
     */
    const encrypt = (text) => {
        return new Promise( (resolve) => {
            const iv = crypto.randomBytes(credentials.ivLength);
            let cipher = crypto.createCipheriv('aes-256-cbc', Buffer.from(credentials.encryptionKey), iv);
            let encrypted = cipher.update(text);

            encrypted = Buffer.concat([encrypted, cipher.final()]);
            const cryptoText = iv.toString('hex') + ':' + encrypted.toString('hex');

            resolve(cryptoText);
        });
    };
    server.method('encrypt', encrypt, {});


    /**
     *
     * @param text
     * @returns {Promise<unknown>}
     */
    const decrypt = (text) => {
        return new Promise( (resolve) => {
            const textParts = text.split(':');
            const iv = Buffer.from(textParts.shift(), 'hex');
            let encryptedText = Buffer.from(textParts.join(':'), 'hex');
            let decipher = crypto.createDecipheriv('aes-256-cbc', Buffer.from(credentials.encryptionKey), iv);
            let decrypted = decipher.update(encryptedText);

            decrypted = Buffer.concat([decrypted, decipher.final()]);

            resolve(decrypted.toString());
        });
    };
    server.method('decrypt', decrypt, {});


    /**
     *
     * @param input
     * @param primitive
     * @returns {Promise<unknown>}
     */
    const securityParamsFilter = (input, primitive = true) => {
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
        });
    };
    server.method('securityParamsFilter', securityParamsFilter, {});


    /**
     *
     * @param movieName
     * @returns {Promise<unknown>}
     */
    const createPathToMovie = (movieName) => {
        return new Promise( (resolve) => {
            const path = Path.join(__dirname, './public/movies', movieName);
            resolve(path);
        });
    };
    server.method('createPathToMovie', createPathToMovie, {});
};
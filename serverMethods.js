'use strict';

const {
    ENCRYPT_DECRYPT_ALGORITHM,
    SERVER_ENCRYPTION_KEY,
    SERVER_ENCRYPTION_KEY_IV_LENGTH,
    PATH_TO_MOVIE_DIRECTORY
} = process.env;

const Crypto = require('crypto');
const Path = require('path');
const Hoek = require('@hapi/hoek');

const { Movie } = require('./models');

module.exports = (server) => {
    /**
     * Encrypt any text
     * @param {String} text Input text
     * @returns {Promise<String>}
     */
    const encrypt = (text) => {
        return new Promise( (resolve) => {
            const iv = Crypto.randomBytes(Number.parseInt(SERVER_ENCRYPTION_KEY_IV_LENGTH, 10));
            let cipher = Crypto.createCipheriv(ENCRYPT_DECRYPT_ALGORITHM, Buffer.from(SERVER_ENCRYPTION_KEY), iv);
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
            let decipher = Crypto.createDecipheriv(ENCRYPT_DECRYPT_ALGORITHM, Buffer.from(SERVER_ENCRYPTION_KEY), iv);
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
                if (!input || typeof input !== 'object' || Array.isArray(input)) {
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
     * @param {String} movieId
     * @returns {Promise<String>}
     */
    const createPathToMovie = async (movieId) => {
        if (typeof movieId !== 'string' || movieId.trim() === '') {
            // return throw new Error('Bad argument');
            return Promise.reject('Bad argument');
        }

        const { sourceVideo } = await Movie.findMovieById(movieId, [], true);

        return Path.join(__dirname, PATH_TO_MOVIE_DIRECTORY, sourceVideo);
    };
    server.method('createPathToMovie', createPathToMovie, {
        cache: {
            expiresIn: 60000,
            generateTimeout: 300
        }
    });
};
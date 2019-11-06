'use strict';

const crypto = require('crypto');
const credentials = require('./credentials').crypto;

module.exports = [
    {
        name: 'encrypt',
        method: (text) => {
            const iv = crypto.randomBytes(credentials.ivLength);
            let cipher = crypto.createCipheriv('aes-256-cbc', Buffer.from(credentials.encryptionKey), iv);
            let encrypted = cipher.update(text);

            encrypted = Buffer.concat([encrypted, cipher.final()]);

            return iv.toString('hex') + ':' + encrypted.toString('hex');
        },
        options: {}
    },
    {
        name: 'decrypt',
        method: (text) => {
            const textParts = text.split(':');
            const iv = Buffer.from(textParts.shift(), 'hex');
            let encryptedText = Buffer.from(textParts.join(':'), 'hex');
            let decipher = crypto.createDecipheriv('aes-256-cbc', Buffer.from(credentials.encryptionKey), iv);
            let decrypted = decipher.update(encryptedText);

            decrypted = Buffer.concat([decrypted, decipher.final()]);

            return decrypted.toString();
        },
        options: {}
    },
    {
        name: 'securityParamsFilter',
        method: (input, primitive = true) => {
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
        },
        options: {}
    }
];
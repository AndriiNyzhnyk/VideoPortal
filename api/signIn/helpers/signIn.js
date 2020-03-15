'use strict';

// Get process environments
const { JSON_WEB_TOKEN_KEY } = process.env;

const Crypto = require('crypto');
const JWT = require('jsonwebtoken');

const self = module.exports = {
    // Check the password hash
    verifyPassword: (password, original) => {
        return new Promise((resolve) => {
            const salt = original.split('$')[0];
            const originalHash = original.split('$')[1];
            const hash = Crypto.pbkdf2Sync(password, salt, 2048, 32, 'sha512').toString('hex');

            resolve( hash === originalHash);
        });
    },

    checkUserCredentials: async (user, password) => {
        // Preparing response object
        const invalidUser = {
            isValid: false,
            isActivate: 'Does not matter'
        };

        const unactivatedUser = {
            isValid: true,
            isActivate: false
        };

        // Check if user exist
        if (!user) {
            return invalidUser;
        }

        const isValidPassword = await self.verifyPassword(password, user.password);

        // Check if user input valid password
        if (!isValidPassword) {
            return invalidUser;
        }

        // Check if user is activated
        if (!user.active) {
            return unactivatedUser;
        }

        return {
            isValid: true,
            isActivate: true
        };
    },

    createCredentials: async (SM, user) => {
        const tokenId = Crypto.randomBytes(16).toString('hex');
        const encryptedUserId = await SM.encrypt(user._id.toString());

        const accessToken = await self.createAccessToken(tokenId, encryptedUserId);
        const refreshToken = await self.createRefreshToken(tokenId, encryptedUserId);

        return {accessToken, refreshToken};
    },

    createAccessToken: (tokenId, userId) => {
        return new Promise((resolve) => {
            const dataForToken = {
                tokenId,
                userId,
                type: 'access'
            };

            const token = JWT.sign(dataForToken,
                JSON_WEB_TOKEN_KEY,
                {
                    expiresIn: '1h',
                    algorithm: 'HS256'
                });

            resolve(token);
        });
    },

    createRefreshToken: (tokenId, userId) => {
        return new Promise((resolve) => {
            const dataForToken = {
                tokenId,
                userId,
                type: 'refresh'
            };

            const token = JWT.sign(dataForToken,
                JSON_WEB_TOKEN_KEY,
                {
                    expiresIn: '72h',
                    algorithm: 'HS256'
                });

            resolve(token);
        });
    }
};
'use strict';

const Crypto = require('crypto');
const JWT = require('jsonwebtoken');
const _ = require('lodash');
const User = require('../../../models/User');
const func = require('../../../functions');
const jsonWebToken = require('../../../credentials').jsonwebtoken;
const {decrypt, encrypt} = require('../../../crypto');

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

    findUser: async (userName) => {
        const nameOrEmail = await func.securityParamsFilter(userName, true);

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
    },

    createCredentials: async (user) => {
        const tokenId = Crypto.randomBytes(16).toString('hex');
        const encryptedUserId = encrypt(user._id.toString());

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

            const token = JWT.sign(dataForToken, jsonWebToken.key);

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

            const token = JWT.sign(dataForToken, jsonWebToken.key);

            resolve(token);
        });
    }
};
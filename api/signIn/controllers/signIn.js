'use strict';

const Crypto = require('crypto');
const Hoek = require('@hapi/hoek');
const User = require('../../../models/User');
const Boom = require('@hapi/boom');
const JWT = require('jsonwebtoken');
const Helpers = require('../helpers/signIn');
const func = require('../../../functions');

const credentialsJwt = require('../../../credentials').jwt;

const self = module.exports = {
    signIn: async (req, h) => {
        return h.view('signIn', {});
    },

    login: async (req, h) => {
        try {
            const {userName, password} = await func.securityParamsFilter(req.payload, false);
            const user = await Helpers.findUser(userName);

            const {isValid, isActivate} = await self.checkUserCredentials(user, password);

            if (!isValid) {
                return Boom.badRequest('Wrong user name(email) or password');
            }

            if (isActivate) {
                return h.redirect('/activate-user-page').temporary();
            }


        } catch (e) {
            console.log(e);
            h.response('Internal server error!');
        }
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

        const isValidPassword = await Helpers.verifyPassword(password, user.password);

        // Check if user input valid password
        if (!isValidPassword) {
            return invalidUser;
        }

        // Check if user is activated
        if (!user.active) {
            return unactivatedUser;
        }
    },

    getActivateUserPage: async (req, h) => {
        return h.view('activateUserPage', {});
    }
};
'use strict';

const Crypto = require('crypto');
const Hoek = require('@hapi/hoek');
const User = require('../../../models/User');
const Boom = require('@hapi/boom');
const JWT = require('jsonwebtoken');
const Helpers = require('../helpers/signIn');

const credentialsJwt = require('../../../credentials').jwt;

const self = module.exports = {
    signIn: async (req, h) => {
        return h.view('signIn', {});
    },

    login: async (req, h) => {
        try {
            const SM = req.server.methods;

            const {userName, password} = req.payload;
            const user = await Helpers.findUser(userName);

            const {isValid, isActivate} = await Helpers.checkUserCredentials(user, password);

            if (!isValid) {
                return Boom.badRequest('Wrong user name(email) or password');
            }

            if (!isActivate) {
                return h.redirect('/activate-user-page').temporary();
            }

            const {accessToken, refreshToken} = await Helpers.createCredentials(SM, user);

            await User.findByIdAndUpdate(user._id, {token: refreshToken});

            return {accessToken, refreshToken};

        } catch (e) {
            console.log(e);
            return Boom.badImplementation('don\'t worry we are working on that');
        }
    },

    getActivateUserPage: async (req, h) => {
        return h.view('activateUserPage', {});
    }
};
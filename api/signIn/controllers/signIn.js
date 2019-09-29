'use strict';

const Crypto = require('crypto');
const Hoek = require('@hapi/hoek');
const User = require('../../../models/User');
const Boom = require('@hapi/boom');
const JWT = require('jsonwebtoken');
const Service = require('../services/signIn');

const credentialsJwt = require('../../../credentials').jwt;

const self = module.exports = {
    signIn: async (req, h) => {
        return h.view('signIn', {});
    },

    login: async (req, h) => {
        try {
            const { userName, password } = req.payload;
            const user = await Service.findUser(userName);

            if (user) {
                const isValidPassword = await Service.verifyPassword(password, user.password);

                if (!isValidPassword) {
                    return Boom.badRequest('Wrong user name(email) or password');
                }
            } else {
                return Boom.badRequest('Wrong user name(email) or password');
            }

            if (!user.active) {
                return h.redirect('/activate-user-page').temporary();
            }

        } catch (e) {
            console.log(e);
            h.response('Internal server error!');
        }
    },

    getActivateUserPage: async (req, h) => {
        return h.view('activateUserPage', {});
    }
};
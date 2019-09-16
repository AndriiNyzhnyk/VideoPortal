'use strict';

const Crypto = require('crypto');
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
            const user = await User.findOne({
                $or: [{name: userName}, {email: userName}]
            });
            const isValidPassword = await Service.verifyPassword(password, user.password);

            if (!user.active) {
                return Boom.badRequest('User is still not verified');
            }

            if (!user || !isValidPassword) {
                return Boom.badRequest('Wrong user name(email) or password');
            }

        } catch (e) {
            console.log(e);
            h.response('Internall server errors!');
        }
    },

    testRoutes: async (req, h) => {
        h.response('Hi');
    }
};
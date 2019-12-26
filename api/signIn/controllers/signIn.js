'use strict';

const { User } = require('../../../models');
const Boom = require('@hapi/boom');
const Helpers = require('../helpers/signIn');

const self = module.exports = {
    signIn: async (req, h) => {
        return h.view('signIn', {});
    },

    login: async (req, h) => {
        try {
            const SM = req.server.methods;

            const { userName, password } = req.payload;
            const user = await User.fetchUserByNameOrEmail(userName);

            const {isValid, isActivate} = await Helpers.checkUserCredentials(user, password);

            if (!isValid) {
                return Boom.badRequest('Wrong user name(email) or password');
            }

            if (!isActivate) {
                return h.redirect('/activate-user-page').temporary();
            }

            const { accessToken, refreshToken } = await Helpers.createCredentials(SM, user);

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
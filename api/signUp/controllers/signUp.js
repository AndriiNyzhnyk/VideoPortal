'use strict';

const Crypto = require('crypto');
const Boom = require('@hapi/boom');
const Hoek = require('@hapi/hoek');
const { User, PendingUser } = require('../../../models');
const Service = require('../services/signUp');
const Hashing = require('../services/hashing');

const self = module.exports = {
    getSignUpPage: async (req, h) => {
        try {
            return h.view('signUp', {});
        } catch (err) {
            console.error(err);
        }
    },

    registration: async (req, h) => {
        try {
            const { userName:name, email, password } = req.payload;
            const activateCode = Crypto.randomBytes(20).toString('hex');
            const hashedPassword = await Hashing.hashPassword(password);

            const user = await User.createNewUser({
                name,
                email,
                password: hashedPassword,
            });

            await PendingUser.createPendingUser(user._id.toString(), activateCode);

            const link = await Service.generateLinkForActivateUser(activateCode);
            const data = await Service.sendEmail(email, link);

            if (data.error) {
                return Boom.badImplementation();
            }

            return h.response();

        } catch (err) {
            console.error(err);
        }
    },

    activateUser: async (req, h) => {
        try {
            const activateCode = Hoek.escapeHtml(req.params.code);
            const pendingUser = await PendingUser.fetchOne({ activateCode });

            if (!pendingUser) {
                return 'This user is already active or does not exist';
            }

            await User.findByIdAndUpdate(pendingUser.userId, { active: true });
            await PendingUser.findByIdAndRemove(pendingUser._id.toString());

            return h.response();

        } catch (err) {
            console.error(err);
        }
    }
};
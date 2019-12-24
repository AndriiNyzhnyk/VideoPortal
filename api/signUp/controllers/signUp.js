'use strict';

const Boom = require('@hapi/boom');
const User = require('../../../models/User');
const ActivateUser = require('../../../models/ActivateUsers');
const Service = require('../services/signUp');
const Hashing = require('../services/hashing');

const Crypto = require('crypto');

const self = module.exports = {
    getSignUpPage: async (req, h) => {
        return h.view('signUp', {});
    },

    registration: async (req, h) => {
        try {
            const activateCode = Crypto.randomBytes(20).toString('hex');
            const pass = await Hashing.hashPassword(req.payload.password);

            const user = await User.create({
                name: req.payload.userName,
                email: req.payload.email,
                password: pass,
            });

            await ActivateUser.create({
                userId: user._id.toString(),
                activateCode
            });

            const link = await Service.generateLinkForActivateUser(activateCode);
            const data = await Service.sendEmail(user.email, link);

            if (data.error) {
                return Boom.badImplementation('Terrible implementation');
            }

            return h.response();

        } catch (e) {
            console.log(e);
        }
    },

    activateUser: async (req, h) => {
        try {
            const pendingUser = await ActivateUser.findOne({
                activateCode: req.params.code
            });

            if (!pendingUser) {
                return 'This user is already active or does not exist';
            }

            await User.findByIdAndUpdate(pendingUser.userId, {
                active: true
            });

            await ActivateUser.findByIdAndRemove(pendingUser._id.toString());

            return h.response();

        } catch (e) {
            console.log(e);
        }
    }
};
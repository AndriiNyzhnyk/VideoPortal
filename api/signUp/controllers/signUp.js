'use strict';

const Boom = require('@hapi/boom');
const { User, ActivateUser } = require('../../../models');
const Service = require('../services/signUp');
const Hashing = require('../services/hashing');

const Crypto = require('crypto');

const self = module.exports = {
    getSignUpPage: async (req, h) => {
        return h.view('signUp', {});
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

            await ActivateUser.create({
                userId: user._id.toString(),
                activateCode
            });

            const link = await Service.generateLinkForActivateUser(activateCode);
            const data = await Service.sendEmail(email, link);

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
'use strict';

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

            let user = await User.create({
                name: req.payload.userName,
                email: req.payload.email,
                password: pass,
            });

            await ActivateUser.create({
                userId: user._id.toString(),
                activateCode
            });

            const link = await self.generateLinkForActivateUser(activateCode);
            const data = await Service.sendEmail(user.email, link);

            return data;

        } catch (e) {
            console.log(e);
        }
    },

    generateLinkForActivateUser: (activateCode) => {
        return new Promise((resolve) => {
            resolve(`https://localhost:3000/activate-user/${activateCode}`)
        });
    },

    activateUser: async (req, h) => {
        try {
            const activateCode = req.params.code;
            console.log(activateCode);

            const pendingUser = await ActivateUser.findOne({
                activateCode
            });

            if (pendingUser) {
                await User.findByIdAndUpdate(pendingUser.userId, {
                    active: true
                });

                await ActivateUser.findByIdAndRemove(pendingUser._id.toString());

                return 'OK';
            } else {
                return 'This user is already active or does not exist';
            }

        } catch (e) {
            console.log(e);
        }
    }
};
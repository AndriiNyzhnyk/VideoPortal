'use strict';

const User = require('../../../models/User');
const ActivateUser = require('../../../models/ActivateUsers');

const Crypto = require('crypto');

const self = module.exports = {
    getSignUpPage: async (req, h) => {
        return h.view('signUp', {
            title: 'examples/handlebars/templates/basic | hapi ' + req.server.version,
            message: 'Hello Handlebars!'
        });
    },

    registration: async (req, h) => {
        try {
            const activateCode = Crypto.randomBytes(20).toString('hex');

            let user = await User.create({
                name: req.payload.userName,
                email: req.payload.email,
                password: req.payload.password,
            });

            await ActivateUser.create({
                userId: user._id.toString(),
                activateCode
            });

            return await self.generateLinkForActivateUser(activateCode);

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

            await User.findByIdAndUpdate(pendingUser.userId, {
                active: true
            });

            await ActivateUser.findByIdAndRemove(pendingUser._id.toString());

            return 'OK';

        } catch (e) {
            console.log(e);
        }
    }
};
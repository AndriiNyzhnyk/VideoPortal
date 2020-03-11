'use strict';

const Path = require('path');
const { User } = require('../../../models');
const Boom = require('@hapi/boom');
const Helpers = require('../helpers/admin');

const directoryForUploadedMovies = Path.join(__dirname, '../../../uploads/movies');
const directoryForUploadedImages = Path.join(__dirname, '../../../uploads/images');


const self = module.exports = {
    adminControlPanel: async (req, h) => {
        return h.view('adminControlPanel', {});
    },

    tmp: async (req, h) => {
        try {
            const SM = req.server.methods;

            const {userName, password} = await SM.securityParamsFilter(req.payload, false);
            // const user = await Helpers.findUser(SM, userName);
            const user = await User.fetchUserByNameOrEmail();

            const {isValid, isActivate} = await self.checkUserCredentials(user, password);

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
            return Boom.badImplementation();
        }
    },

    movieFileUpload: async (req, h) => {
        try {
            const { file, newFileName } = req.payload;

            const filename = newFileName || file.hapi.filename;
            const path = Path.join(directoryForUploadedMovies, filename);

            await Helpers.handleStreamFileUpload(path, file);

            return h.response();
        } catch (err) {
            console.error(err);
            return Boom.badImplementation();
        }
    },

    imageFileUpload: async (req, h) => {
        try {
            const {file, newFileName} = req.payload;

            if (typeof file !== 'object') {
                return Boom.badRequest();
            }

            const filename = newFileName || file.hapi.filename;
            const path = Path.join(directoryForUploadedImages, filename);

            await Helpers.handleStreamFileUpload(path, file);

            return h.response();
        } catch (err) {
            console.error(err);
            return Boom.badImplementation();
        }
    }
};
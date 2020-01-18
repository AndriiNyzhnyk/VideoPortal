'use strict';

const Path = require('path');
const { User, Movie } = require('../../../models');
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
            h.response('Internal server error!');
        }
    },

    movieFileUpload: async (req, h) => {
        try {
            const { file, newFileName } = req.payload;

            const filename = newFileName || file.hapi.filename;
            const path = Path.join(directoryForUploadedMovies, filename);

            await Helpers.handleStreamFileUpload(path, file);

            return { success: true };
        } catch (err) {
            console.error(err);
        }
    },
    imageFileUpload: async (req, h) => {
        try {
            const {file, newFileName} = req.payload;

            const filename = newFileName || file.hapi.filename;
            const path = Path.join(directoryForUploadedImages, filename);

            await Helpers.handleStreamFileUpload(path, file._data);

            return { success: true };
        } catch (err) {
            console.error(err);
        }
    },

    addNewMovie: async (req, h) => {
        try {
            const movie = await Movie.addNewMovieToDb(req.payload);
            console.log(movie);

            return h.response();
        } catch (err) {
            console.log(err);
            return Boom.badImplementation('Internal server error!');
        }
    }
};
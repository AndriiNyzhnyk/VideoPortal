'use strict';

const Crypto = require('crypto');
const Hoek = require('@hapi/hoek');
const Boom = require('@hapi/boom');
const JWT = require('jsonwebtoken');
const Helpers = require('../helpers/videoStream');


const self = module.exports = {
    watchMovie: async (req, h) => {
        const SM = req.server.methods;
        const movieName = await SM.securityParamsFilter(req.params.name, true);
        const pathToMovie = await SM.createMoviePath(movieName + '.mp4');
        const range = req.headers.range;

        const result = await Helpers.videoStream(pathToMovie, range);
        const response = h.response(result.file);
        response.statusCode = result.httpCode;

        return Helpers.setHeaders(response, result.headers);
    }
};
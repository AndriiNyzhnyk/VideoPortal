'use strict';

const Crypto = require('crypto');
const Hoek = require('@hapi/hoek');
const Boom = require('@hapi/boom');
const JWT = require('jsonwebtoken');
const Helpers = require('../helpers/videoStream');


const self = module.exports = {
    watchMovie: async (req, h) => {
        const SM = req.server.methods;

        // Preparing headers and status code for response (depends on browsers request)
        const statusCode = 206;

        const getHeadersForRangeMood = ({start, end, chunkSize, fileSize}) => {
            return [
                ['Content-Range', `bytes ${start}-${end}/${fileSize}`],
                ['Accept-Ranges', 'bytes'],
                ['Content-Length', chunkSize],
                ['Content-Type', 'video/mp4']
            ];
        };

        const getHeadersForInitMood = ({fileSize}) => {
            return [
                ['Content-Length', fileSize],
                ['Content-Type', 'video/mp4']
            ];
        };

        // Preparing data for real-time video stream
        const movieName = await SM.securityParamsFilter(req.params.name, true);
        const pathToMovie = await SM.createPathToMovie(movieName + '.mp4');
        const range = req.headers.range;

        const {file, isRange, data} = await Helpers.videoStream(pathToMovie, range);
        const headers = isRange ? getHeadersForRangeMood(data) : getHeadersForInitMood(data);


        const response = h.response(file);
        response.statusCode = statusCode;

        return Helpers.setHeaders(response, headers);
    }
};
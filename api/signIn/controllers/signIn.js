'use strict';

const User = require('../../../models/User');
const Service = require('../services/signIn');

const Crypto = require('crypto');

const self = module.exports = {
    signIn: async (req, h) => {
        return h.view('signIn', {});
    },

    testRoutes: async (req, h) => {
        h.response('Hi');
    }
};
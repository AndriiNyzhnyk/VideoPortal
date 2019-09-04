'use strict';

const User = require('../../../models/User');
const Service = require('../services/forgotPass');

const self = module.exports = {
    getPage: async (req, h) => {
        return h.view('forgotPass', {});
    },
};
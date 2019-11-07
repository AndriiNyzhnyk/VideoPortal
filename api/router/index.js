'use strict';

const common = require('../common');
const signUp = require('../signUp/routes');
const signIn = require('../signIn/routes');
const forgotPass = require('../forgotPassword/routes');
const admin = require('../admin/routes');
const videoStream = require('../videoStream/routes');

module.exports = [
    ...signUp,
    ...common,
    ...signIn,
    ...forgotPass,
    ...admin,
    ...videoStream
];
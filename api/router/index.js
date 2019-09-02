'use strict';

const common = require('../common');
const signUp = require('../signUp/routes');
const signIn = require('../signIn/routes');

module.exports = [...signUp, ...common, ...signIn];
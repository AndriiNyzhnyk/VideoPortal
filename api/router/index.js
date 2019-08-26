'use strict';

const common = require('../common');
const signUp = require('../signUp/routes');

module.exports = [...signUp, ...common];
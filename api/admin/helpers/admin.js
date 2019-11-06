'use strict';

const Crypto = require('crypto');
const JWT = require('jsonwebtoken');
const _ = require('lodash');
const User = require('../../../models/User');
const func = require('../../../functions');
const jsonWebToken = require('../../../credentials').jsonwebtoken;

const self = module.exports = {

};
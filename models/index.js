'use strict';

const User = require('./user');
const Comment = require('./comment');
const PendingUser = require('./pendingUser');
const ForgotPassword = require('./forgotPassword');
const Movie = require('./movie');

module.exports = { Comment, User, PendingUser, ForgotPassword, Movie };
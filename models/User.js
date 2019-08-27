const Mongoose = require('mongoose');
const Schema = Mongoose.Schema;

const user = new Schema({
    name:  String,
    email: String,
    password: String,
    active: {
        type: Boolean,
        default: false
    },
    activateCode: String
});

module.exports = Mongoose.model('User', user);
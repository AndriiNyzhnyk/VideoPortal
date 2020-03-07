const Mongoose = require('mongoose');
const Schema = Mongoose.Schema;

const user = new Schema({
    name:  {
        type: String,
        required: true,
        minlength: 3,
        maxlength: 20
    },
    email: {
        type: String,
        required: true
    },
    password: {
        type: String,
        required: true
    },
    active: {
        type: Boolean,
        default: false
    },
    registrationDate: {
        type: Date,
        default: new Date
    },
    lastLogin: {
        type: String,
        default: ''
    },
    token: {
        type: String,
        default: ''
    },
    favourites: [ {type: Schema.Types.ObjectId, ref: 'Movie'} ]
});

module.exports = Mongoose.model('User', user);
const Mongoose = require('mongoose');
const Schema = Mongoose.Schema;

const comment = new Schema({
    author:  {
        type: Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    movie: {
        type: Schema.Types.ObjectId,
        ref: 'Movie',
        required: true
    },
    text: {
        type: String,
        required: true,
        minlength: 1,
        maxlength: 5000
    },
    posted: {
        type: Date,
        default: new Date()
    }
});

module.exports = Mongoose.model('Comment', comment);
'use strict';

const Mongoose = require('mongoose');
const Schema = Mongoose.Schema;

const movie = new Schema({
    nameUa: {
        type: String,
        required: true,
        minlength: 1,
        maxlength: 100
    },
    nameEn: {
        type: String,
        required: true,
        minlength: 1,
        maxlength: 100
    },
    sourceImg: {
        type: String,
        required: true,
        minlength: 1,
        maxlength: 100
    },
    sourceVideo: {
        type: String,
        required: true,
        minlength: 1,
        maxlength: 100
    },
    qualityVideo:  {
        type: Number,
        required: true,
        min: 144,
        max: 4320 // 7680 x 4320 - is known as 8K
    },
    translation: {
        type: String,
        required: true,
        minlength: 1,
        maxlength: 100
    },
    motto: {
        type: String,
        required: true,
        minlength: 1,
        maxlength: 100
    },
    year: {
        type: Number,
        required: true,
        min: 2000,
        max: 3000
    },
    country: {
        type: String,
        required: true,
        minlength: 1,
        maxlength: 100
    },
    genre: [String],
    category: [String],
    producer: {
        type: String,
        required: true,
        minlength: 1,
        maxlength: 100
    },
    duration:{
        type: Number,
        required: true,
        min: 0,
        max: 1000
    },
    age: {
        type: Number,
        required: true,
        min: 3,
        max: 100
    },
    firstRun: {
        type: Date,
        required: true
    }
});

module.exports = Mongoose.model('Movie', movie);
'use strict';

const { Movie, Comment } = require('../../models');

module.exports = [
    {
        method: 'GET',
        path: '/',
        handler: (req, h) => {
            return h.view('home', {});
        },
        options: { auth: false },
    },
    {
        method: 'GET',
        path: '/token-test',
        handler: (req, h) => {

            console.log(req.info);
            return 'Well Done';
        },
        options: { auth: 'jwt' },
    },
    {
        method: 'GET',
        path: '/movie',
        handler: (req, h) => {
            return h.view('moviePage', {});
        },
        options: { auth: false },
    },
    {
        method: 'GET',
        path: '/test-video',
        handler: (req, h) => {
            return h.file('TestStream.html');
        },
        options: { auth: false },
    },
    {
        method: 'GET',
        path: '/test-file-upload',
        handler: (req, h) => {
            return h.file('fileUpload.html');
        },
        options: { auth: false },
    },
    {
        method: 'POST',
        path: '/comment',
        handler: async (req, h) => {
            try {
                console.log(req.payload);

                const comment = await Comment.addNewComment(req.payload);
                console.log(comment);
                const ttt = await Movie.addNewCommentToMovie(comment.movie, comment._id);
                console.log(ttt);

                return h.response();
            } catch (err) {
                console.error(err);
            }
        },
        options: { auth: false },
    },
    {
        method: 'GET',
        path: '/{param*}',
        handler: {
            directory: {
                path: '.',
                redirectToSlash: true
            }
        },
        options: { auth: false },
    }
];
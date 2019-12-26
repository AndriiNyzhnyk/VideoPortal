const Comment = require('./Comment');

const self = module.exports = {

    /**
     * Add new comment to DB
     * @param {objectId} author Reference to author this post
     * @param {objectId} movie Reference to movie this post
     * @param {string} text Body of the comment
     * @returns {Promise<*>} New comment
     */
    addNewComment: ({author, movie, text}) => {
        return Comment.create({
            author,
            movie,
            text,
        });
    }
};
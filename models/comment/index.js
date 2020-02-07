const Comment = require('./Comment');

const self = module.exports = {

    /**
     * Add new comment to DB
     * @param {objectId} author Reference to author this post(comment)
     * @param {objectId} movie Reference to movie this post(comment)
     * @param {string} text Body of the comment
     * @returns {Promise<*>} New comment
     */
    addNewComment: ({author, movie, text}) => {
        return Comment.create({
            author,
            movie,
            text,
        });
    },

    /**
     * Find comment by '_id'
     * @param {Object || Number || String} commentId
     * @returns {Promise<*>}
     */
    findCommentById: (commentId) => {
        return Comment.findById(commentId);
    },

    /**
     * Remove comment by '_id'
     * @param {Object || Number || String} commentId
     * @returns {Promise<*>}
     */
    removeCommentById: (commentId) => {
        return Comment.findByIdAndRemove(commentId);
    }
};
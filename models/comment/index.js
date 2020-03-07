const Comment = require('./Comment');

const self = module.exports = {

    /**
     * Add new comment to DB
     * @param {objectId} author Reference to author this post(comment)
     * @param {objectId} movie Reference to movie this post(comment)
     * @param {string} text Body of the comment
     * @returns {Promise<Object>} New comment
     */
    addNewComment: ({author, movie, text}) => {
        return Comment
            .create({
                author,
                movie,
                text,
            });
    },

    /**
     * Find comment by '_id'
     * @param {Object || Number || String} commentId
     * @param {Boolean} lean
     * @returns {Promise<*>}
     */
    findCommentById: (commentId, lean = false) => {
        return Comment
            .findById(commentId)
            .lean(lean);
    },

    /**
     * Remove comment by '_id'
     * @param {Object || Number || String} commentId
     * @param {Boolean} lean
     * @returns {Promise<*>}
     */
    removeCommentById: (commentId, lean = false) => {
        return Comment
            .findByIdAndRemove(commentId)
            .lean(lean);
    }
};
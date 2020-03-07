const User = require('./User');

const self = module.exports = {

    /**
     * Find user by '_id'
     * @param {Object || Number || String} userId
     * @param {Boolean} lean
     * @returns {Promise<Object || Null>}
     */
    findUserById: (userId, lean= false) => {
        return User.findById(userId).lean(lean);;
    },

    /**
     * Add new user to DB
     * @param {string} name User name
     * @param {string} email User email
     * @param {string} password Hashed user password
     * @returns {Promise<Object>} New user
     */
    createNewUser: ({ name, email, password }) => {
        return User.create({
            name,
            email,
            password
        });
    },

    /**
     * Find document into DB and update his
     * @param {string || objectId} id Have to equal '_id' any document into DB
     * @param {object} params Params which should be updated
     * @returns {Promise<Object>} Updated document
     */
    findByIdAndUpdate: (id, params) => {
        return User.findByIdAndUpdate(id, params);
    },

    /**
     * Fetch user by name or email
     * @param {string} nameOrEmail User name or email
     * @returns {Promise<Object>}
     */
    fetchUserByNameOrEmail: (nameOrEmail) => {
        return User.findOne({
            $or: [
                { name: nameOrEmail },
                { email: nameOrEmail }
            ]
        });
    },

    /**
     * Remove user by '_id'
     * @param {Object || Number || String} userId
     * @returns {Promise<Object>}
     */
    removeUserById: (userId) => {
        return User.findByIdAndRemove(userId);
    },

    /**
     *
     * @param {String} userId
     * @param {String} movieId
     * @returns {Promise<Object>}
     */
    addMovieToFavourites: (userId, movieId) => {
        return User.findByIdAndUpdate(userId, { $addToSet: { favourites: movieId } });
    }
};
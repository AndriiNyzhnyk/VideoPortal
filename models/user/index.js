const User = require('./User');

const self = module.exports = {

    /**
     * Find user by '_id'
     * @param {Object || Number || String} userId
     * @returns {Promise<*>}
     */
    findUserById: (userId) => {
        return User.findById(userId);
    },

    /**
     * Add new user to DB
     * @param {string} name User name
     * @param {string} email User email
     * @param {string} password Hashed user password
     * @returns {Promise<*>} New user
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
     * @returns {Promise<*>} Updated document
     */
    findByIdAndUpdate: (id, params) => {
        return User.findByIdAndUpdate(id, params);
    },

    /**
     * Fetch user by name or email
     * @param {string} nameOrEmail User name or email
     * @returns {Promise<*>}
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
     * @returns {*}
     */
    removeUserById: (userId) => {
        return User.findByIdAndRemove(userId);
    }
};
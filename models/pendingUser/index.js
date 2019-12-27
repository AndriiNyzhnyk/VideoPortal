const PendingUser = require('./PendingUser');

const self = module.exports = {
    /**
     * Create temp state before activate user
     * @param {string} userId User '_id' into DB
     * @param {string} activateCode
     * @returns {Promise<*>} Mongoose 'entry' object
     */
    createPendingUser: (userId, activateCode) => {
        return PendingUser.create({
            userId,
            activateCode
        });
    },

    /**
     * Fetch one 'entry' for pending user
     * @param {object} filter Filter compatible with Mongoose model
     * @returns {*}
     */
    fetchOne: (filter) => {
       return PendingUser.findOne(filter);
    },

    /**
     * Remove entry if the user is successfully verified (by email) or other reason
     * @param {string} id Entry '_id' into DB
     * @returns {Promise} Result of operations
     */
    findByIdAndRemove: (id) => {
        return PendingUser.findByIdAndRemove(id);
    }
};
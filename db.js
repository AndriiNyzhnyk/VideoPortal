const Mongoose = require('mongoose');
const { DB_URL, DB_NAME } = process.env;

/**
 * Create connection to MongoDB
 * @returns {Promise}
 */
module.exports = () => {
    return Mongoose.connect(`${DB_URL}/${DB_NAME}`, {
        useNewUrlParser: true,
        useUnifiedTopology: true,
        useFindAndModify: false
    });
};
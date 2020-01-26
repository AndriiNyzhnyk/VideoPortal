const Mongoose = require('mongoose');
const {DB_URL, DB_NAME} = process.env;

module.exports = async () => {
    // Set connection with DB
    return Mongoose.connect(`${DB_URL}/${DB_NAME}`, {
        useNewUrlParser: true,
        useUnifiedTopology: true,
        useFindAndModify: false
    });
};
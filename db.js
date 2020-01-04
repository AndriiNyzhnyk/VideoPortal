const Mongoose = require('mongoose');
const {DB_URL, DB_NAME} = process.env;

module.exports = async () => {
    try {
        // Set connection with DB
        const connect = await Mongoose.connect(`${DB_URL}/${DB_NAME}`, {
            useNewUrlParser: true,
            useUnifiedTopology: true,
            useFindAndModify: false
        });

        console.log(`Mongoose connected - ${connect.connection.host}:${connect.connection.port}`)
    } catch (err) {
        console.error(err);
        process.exit(1);
    }
};
'use strict';

const Mongoose = require('mongoose');

// Get process environments
const { DB_URL, DB_NAME } = process.env;

class MongoDB {
    static async getInstance() {
        if (typeof MongoDB.instance === "undefined") {
            const data = await MongoDB._initializeConnection();
            return new MongoDB(data);
        } else {
            return MongoDB.instance;
        }
    }

    static async _initializeConnection() {
        const connection = await Mongoose.connect(`${DB_URL}/${DB_NAME}`, {
            useNewUrlParser: true,
            useUnifiedTopology: true,
            useFindAndModify: false
        });

        return { connection };
    }

    constructor({ connection }) {
        if (!!MongoDB.instance) {
            return MongoDB.instance;
        }

        this.connection = connection;

        MongoDB.instance = this;
        return this;
    }
}

module.exports = MongoDB;
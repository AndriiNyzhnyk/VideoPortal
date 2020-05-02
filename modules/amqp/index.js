'use strict';

// Get process environments
const { AMQP_URL } = process.env;

const Amqplib = require('amqplib');

class AMQP {
    static async getInstance() {
        if (typeof AMQP.instance === "undefined") {
            const data = await AMQP._initializeConnection();
            return new AMQP(data);
        } else {
            return AMQP.instance;
        }
    }

    static async _initializeConnection() {
        const targetQueue = 'monitoring';

        const connection = await Amqplib.connect(AMQP_URL);
        const channel = await connection.createChannel();
        const queue = await channel.assertQueue(targetQueue);

        return { connection, channel };
    }

    constructor({ connection, channel }) {
        if (!!AMQP.instance) {
            return AMQP.instance;
        }
        this.sendDataToServer = this.sendDataToServer.bind(this);

        this.connection = connection;
        this.channel = channel;

        AMQP.instance = this;
        return this;
    }

    async sendDataToServer(targetQueue = 'monitoring', message) {
        await this.channel.sendToQueue(targetQueue, Buffer.from(message));
    }
}

module.exports = AMQP;
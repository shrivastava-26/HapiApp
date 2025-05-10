const amqp = require('amqplib')

const rabbitConn = async () => {
    const connection = await amqp.connect(process.env.R_PORT);
    const channel = await connection.createChannel();

    return {connection,channel}
}

module.exports = rabbitConn
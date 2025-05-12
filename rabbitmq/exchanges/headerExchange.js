const amqp = require('amqplib');
require('dotenv').config();

const headerExch = async (user, email) => {
  try {
    const connection = await amqp.connect(process.env.R_PORT);
    const channel = await connection.createChannel();

    const exchange = 'header_exchange';
    const message = {
      name: user,
      email: email
    };

    await channel.assertExchange(exchange, 'headers', { durable: true });

    channel.publish(exchange, '', Buffer.from(JSON.stringify(message)), {
      headers: {
        type: "user.created",
        region: "india"
      }
    });

    console.log(`provider sent message: ${JSON.stringify(message)}`);
  } catch (error) {
    console.log(error.message);
  }
};

module.exports = headerExch;

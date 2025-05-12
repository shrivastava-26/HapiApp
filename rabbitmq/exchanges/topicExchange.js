const amqp = require("amqplib");
require("dotenv").config();

const topicExch = async (email, user) => {
  try {
    const connection = await amqp.connect(process.env.R_PORT);
    const channel = await connection.createChannel();
    const exchange = "topic_exchange";
    const routeKey = "user.created";
    const message = {
      name: user,
      email: email
    };

    await channel.assertExchange(exchange, "topic", { durable: true });

    channel.publish(
      exchange,
      routeKey,
      Buffer.from(JSON.stringify(message))
    );

    console.log(`Provider sent message: ${JSON.stringify(message)}`);


  } catch (error) {
    console.log(error.message)
  }
};

module.exports = topicExch;

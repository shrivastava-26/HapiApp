require('dotenv').config();
const rabbitConn = require('../rabbitConnection')


const sendMail = async (name, email) => {
  try {

    let {channel, connection} = await rabbitConn()
    const exchange = 'mail_exchange';
    const queue = 'mail_queue';

    const message = {
      to: "hello@gmail.com",
      from: email,
      msg: `hi ${name}, how are you`,
    };

    await channel.assertExchange(exchange, 'direct', { durable: false });
    await channel.assertQueue(queue, { durable: true });
    await channel.bindQueue(queue, exchange , process.env.ROUTING_KEY);


    channel.publish(
      exchange,
      process.env.ROUTING_KEY,
      Buffer.from(JSON.stringify(message)),
      { persistent: true }

    );

    console.log(`Provider sent message: ${JSON.stringify(message)}`);

    await channel.close();
    await connection.close();

  } catch (error) {
    console.error("Error in sendMail:", error);
  }
};

module.exports = sendMail

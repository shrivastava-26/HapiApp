
const rabbitConn = require('../rabbitConnection')


const fanoutExg = async(name, email) => {

    try {
        const {channel, connection} = await rabbitConn()

    const exchange = "fanout_exchange"
    await channel.assertExchange(exchange, 'fanout', { durable: true });
    
    const message = {
        to:email,
        msg:`this is fanout exchange, hi ${name}, Welcome ${email}`
    }

    await channel.publish(exchange, ' ', Buffer.from(JSON.stringify(message)));
    
    console.log(`Provider sent message: ${JSON.stringify(message)}`);


    await channel.close();
    await connection.close();
    
    } catch (error) {
        console.log(error.message)
    }
    
}

module.exports = fanoutExg
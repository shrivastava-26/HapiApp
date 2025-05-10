const { createClient } = require('redis');
require('dotenv').config();

let client = null;

//! The idea is to create only one Redis client connection for the entire app (singleton pattern).
// We can use iife function also


//todo redis connection

const getRedisClient = async () => {

  if (!client) {
    client = createClient({ url: process.env.REDIS_URL });
   
    client.on('error', (err) => {
      console.error(err.message);
    });

    await client.connect();
    console.log('redis connected');
  }

  return client;
};

//! caching data 
const redisClient = async (key = null, value = null) => {
  const client = await getRedisClient();

  if (key && value !== null) {
    await client.set(key, JSON.stringify(value), { EX: 60 });
    console.log(`"${key}" cached`);
  }

  return client;
};

module.exports = { redisClient };

// config/dbConnection.js
const { Pool } = require('pg');
require('dotenv').config();

const db = new Pool({

  user: process.env.DB_USER,
  host: process.env.DB_HOST,
  database: process.env.DB_NAME,
  password: process.env.DB_PWD,
  port: process.env.DB_PORT

});

let connectToDb = async () => {
  await db.connect()
    .then(() => console.log('Connected to PostgreSQL'))
    .catch(err => console.error(err.message));
}

module.exports = {db, connectToDb};




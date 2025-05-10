// Entry point of the Hapi.js application.
// Responsible for initializing the server, registering plugins, and starting the app.

 
'use strict';

let hapi = require('@hapi/hapi');
const routePlugin = require('./plugins/routePlugin');
const authPlugin = require('./plugins/authPlugin');
const { connectToDb } = require('./config/dbConnection');
const swaggerPlugin = require('./plugins/swaggerPlugin')
require('dotenv').config();

let server = hapi.server({
    port:process.env.PORT,
    host:'localhost'
})


let startServer = async () => {

await server.register([
    routePlugin,
    authPlugin,
    swaggerPlugin
]);

  await connectToDb();
  
  await  server.start()
  console.log('server started at port:', server.info.uri)

  process.on('unhandledRejection', (err)=> {
    console.log(err);
    process.exit(1);
  })
}

startServer();
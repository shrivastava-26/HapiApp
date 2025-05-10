const vision = require('@hapi/vision');
const inert = require('@hapi/inert')
const hapiSwagger = require('hapi-swagger');
const pack = require('../package.json');


const swaggerPlugin = {

  name: 'swaggerPlugin',
  register: async (server) => {
    
    const swaggerOptions = {
      info: {
        title: 'My API Documentation',
        version: pack.version
        },
        documentationPath: '/docs',
        securityDefinitions: {
            jwt: {
              type: 'apiKey',           
              name: 'Authorization',    
              in: 'header',            
            }
        },
        security: [{ jwt: [] }]
    }
      

    await server.register([
      inert,
      vision,
      {
        plugin: hapiSwagger,
        options: swaggerOptions
      }
    ]);
  }
};



module.exports = swaggerPlugin;
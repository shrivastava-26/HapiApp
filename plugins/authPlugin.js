const jwt = require('@hapi/jwt');
require('dotenv').config();

let authPlugin = {

    name: 'authPlugin',
    version: '1.0.0',
    register: async (server, options) => {

        await server.register(jwt)

        // proceed to authentication

        server.auth.strategy( 'jwt', 'jwt', {
            keys: process.env.JWT_SECKEY,

            verify: {
                exp: true,
                maxAgeSec: 14400,
                aud: false,
                iss:false,
                sub:false
            },

            validate: async (artifact, req, h) => {

                let {email, dept} = artifact.decoded.payload;

                if(!email || !dept) {
                    return{
                        isValid: false
                    }
                }

                return {
                    isValid:true,
                    credentials: {email, dept}
                }
            }
        });

        server.auth.default('jwt');

        server.ext('onRequest' , (req,h)=> {
           return h.continue;
        })

        server.ext('onPreHandler', (req,h)=> {

            if(req.auth.isAuthenticated){
                console.log('handler is authenticated')
            }

            return h.continue
        })

    }

}

module.exports = authPlugin;
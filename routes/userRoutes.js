const { alluser, addedUser, deletedUser, singleUser, updatedUser, loggedinUser, signupedUser } = require('../controllers/userController')
let userSchema = require('../schemas/userSchema');
const Joi = require('joi')

let userRoutes = [

    {
        method: 'GET',
        path: '/getuser',
        options: {
            tags: ['api'],
            handler: alluser,
        }
    },

    {
        method: 'GET',
        path: '/getsingleuser/{uid}',
        options: {
            handler: singleUser,
            tags: ['api'],
            validate: {
                params: Joi.object({
                    uid: Joi.number().required().description('User ID')
                })
            }
        }
    },

    { 
        method: 'POST',
        path: '/adduser',

        options: {
            handler: addedUser,
            tags: ['api'],
            validate: {
                payload: userSchema
            }
        }
    },


    {
        method: 'PUT',
        path: '/updateuser/{uid}',
        options: {
            handler: updatedUser,
            tags: ['api'],
            validate: {
                params: Joi.object({
                    uid: Joi.number().required().description('User ID')
                }),
                payload: userSchema
            }
        }
    },

    {
        method: 'DELETE',
        path: '/deleteuser/{uid}',
        options: {
            handler: deletedUser,
            tags: ['api'],
            validate: {
                params: Joi.object({
                    uid: Joi.number().required().description('User ID')
                })
            }
        }
    },

    {
        method: 'POST',
        path: '/login',

        options: {
            handler: loggedinUser,
            tags: ['api'],
            validate: {
                payload: userSchema
            },
            auth: false,
        }
    },

    {
        method: 'POST',
        path: '/signup',

        options: {
            tags: ['api'],
            handler: signupedUser,
            validate: {
                payload: userSchema
            },
            auth: false,
        }
    },

    {
        method: 'GET',
        path: '/admin',
        options: {
            tags: ['api'],
            handler: (req, h) => {

                let { dept } = req.auth.credentials;

                if (!dept) {
                    return h.response({ success: false, message: 'not authorized to access' }).code(403)
                }
                return h.response({ success: true, message: 'welcome to admin route' }).code(200)
            },
        }

    }
]

module.exports = userRoutes;
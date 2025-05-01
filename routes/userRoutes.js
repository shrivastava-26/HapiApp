const { options } = require('joi');
const {alluser, addedUser, deletedUser, singleUser, updatedUser, loggedinUser, signupedUser} = require('../controllers/userController')
let userSchema = require('../schemas/userSchema');
let userRoutes = [
    {
        method:'GET',
        path:'/getuser',
        handler:alluser
    },

    {
        method:'GET',
        path:'/getsingleuser/{uid}',
        handler:singleUser
    },

    {
        method:'POST',
        path:'/adduser',
        handler:addedUser,

        options:{
            validate:{
                payload:userSchema
            }
        }
    },
    
    {
        method: 'PUT',
        path: '/updateuser/{uid}',
        handler:updatedUser
    },

    {
        method:'DELETE',
        path: '/deleteuser/{uid}',
        handler:deletedUser
    },

    {
        method:'POST',
        path:'/login',
        handler:loggedinUser,

        options:{
            auth:false
        }
    },

    {
        method:'POST',
        path:'/signup',
        handler:signupedUser,

        options:{
            validate:{
                payload:userSchema
            },
            auth:false
        }
    },
    {
        method: 'GET',
        path:'/admin',
        handler:  (req, h) => {

            let {dept} = req.auth.credentials;

            if(!dept){
                return h.response({success:false, message:'not authorized to access'}).code(403)
            }
            return h.response({success:true, message:'welcome to admin route'}).code(200)
        }
    }
]

module.exports = userRoutes;
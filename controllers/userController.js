// Controller for handling business logic related to products.
// Contains functions that interact with services, models, and return responses to the client.
// works between routes and models

const { date } = require('joi');
let { getAllUser, deleteUser, getSingleUser, updateUser, createUser, findUserByEmail } = require('../models/userModel');
const jwt = require('@hapi/jwt');

const alluser = async (req, h) => {

    try {
        const user = await getAllUser();
        return h.response({ success: true, message: "user data fetched successfully", data: user }).code(200)
    } catch (error) {
        console.log(error.message)
        throw error
    }

}

const singleUser = async (req, h) => {

    try {
        const user = await getSingleUser(req.params.uid);

        if (!user) {
            return h.response({ success: false, message: "user not found" }).code(404)
        }
        return h.response({ success: true, message: 'user fetched', data: user }).code(200);
    }
    catch (error) {
        return h.response({ success: false, message: error.message }).code(500);
    }

}


const updatedUser = async (req, h) => {

    try {

        const isUpdatedUser = await updateUser(req.params.uid, req.payload)

        if (isUpdatedUser) {
            return h.response({ success: true, message: 'user updated successfully', data: isUpdatedUser }).code(200)
        }

        return h.response({ success: false, message: 'user not found ro update' }).code(404)

    } catch (error) {
        console.log(error.message, 'error while updating');
        throw error
    }
};

const deletedUser = async (req, h) => {

    try {
        let delUser = await deleteUser(req.params.uid);

        if (delUser) {
            return h.response({ success: true, message: "user deleted successfully", data: delUser }).code(200);
        }

        return h.response({ success: false, message: 'user not found to delete' }).code(404);

    } catch (error) {
        console.log(error.message)
        throw error
    }
}

const addedUser = async (req, h) => {

    try {
        let isUser = await findUserByEmail(req.payload);

        if (!isUser) {
            await createUser(req.payload);
            return h.response({ success: true, message: "user created successfully" }).code(200)
        }

        return h.response({ success: false, message: 'user already exists with that email' }).code(404);
    } catch (error) {
        console.log(error.message)
        throw error
    }
}


const loggedinUser = async (req, h) => {
    try {
        
    let { email, dept } = req.payload;
    let user = await findUserByEmail({email});
    console.log(user)

    if (!user || dept !== user.dept) {
        return h.response({ success: false, message: 'invalid credentials' }).code(401)
    }

    let token = jwt.token.generate(
        {
            email: user.email,
            dept: user.dept,
            exp:Math.floor( (Date.now() / 1000)) + 60 * 60
        },
        process.env.JWT_SECKEY
    )

    return h.response({ success: true, message: 'logged in successfully', data: token})

    } catch (error) {
        console.log(error.message)
        throw error
    }
}

const signupedUser = async(req, h) => {

   try {
    let {email} = req.payload;
    let isUser = await findUserByEmail(email);

    if(isUser){
       return h.response({success:false, message: 'user already exits'}).code(403)
    }

    let user = await createUser(req.payload)

    return h.response({success:true, message: "singupedd successfully"}).code(200);
   } catch (error) {
    console.log(error.message)
    throw error
   }
}



module.exports = { alluser, singleUser, updatedUser, deletedUser, addedUser, loggedinUser, signupedUser }



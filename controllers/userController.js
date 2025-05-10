// Controller for handling business logic related to products.
// Contains functions that interact with services, models, and return responses to the client.
// works between routes and models


const jwt = require("@hapi/jwt");
const { redisClient } = require("../utils/redisClient");
const sendMail = require('../rabbitmq/exchanges/directExchange')
let {getAllUser, deleteUser, getSingleUser, updateUser, createUser, findUserByEmail} = require("../models/userModel");
const fanoutExg = require("../rabbitmq/exchanges/fanoutExchange");


const alluser = async (req, h) => {
  try {

    const client = await redisClient();

    const cachedUser = await client.get("all_user");

    if (!cachedUser) {

      const user = await getAllUser()

      if(!user) {
        return h.response({success:true, message:'user not found'}).code(404);
      }
    
      await redisClient("all_user", user);

      return h
        .response({
          success: true,
          message: "Data sent successfully from db",
          data: user,
        }).code(200);
    }

    return h.response({
        success: true,
        message: "User data fetched from cache",
        data: JSON.parse(cachedUser),
      })
      .code(200);
  } catch (err) {
    console.error("Handler error:", err.message);
    return h
      .response({ success: false, message: "Internal Server Error" })
      .code(500);
  }
};

const singleUser = async (req, h) => {
  try {
    const client = await redisClient();
    const uid = req.params.uid;
    const cacheKey = `single_user:${uid}`;

    const cachedUser = await client.get(cacheKey);

    if (!cachedUser) {
      const user = await getSingleUser(uid);

      if (!user) {
        return h
          .response({ success: false, message: "User not found" })
          .code(404);
      }

      await redisClient(cacheKey, user);
      return h
        .response({
          success: true,
          message: "Data fetched from DB",
          data: user,
        })
        .code(200);
    }

    return h
      .response({
        success: true,
        message: "User fetched from cache",
        data: JSON.parse(cachedUser),
      })
      .code(200);
  } catch (error) {
    return h.response({ success: false, message: error.message }).code(500);
  }
};

const updatedUser = async (req, h) => {
  try {
    const isUpdatedUser = await updateUser(req.params.uid, req.payload);

    if (isUpdatedUser) {
      return h
        .response({
          success: true,
          message: "user updated successfully",
          data: isUpdatedUser,
        })
        .code(200);
    }

    return h
      .response({ success: false, message: "user not found ro update" })
      .code(404);
  } catch (error) {
    console.log(error.message, "error while updating");
  }
};

const deletedUser = async (req, h) => {
  try {
    let delUser = await deleteUser(req.params.uid);

    if (delUser) {
      return h
        .response({
          success: true,
          message: "user deleted successfully",
          data: delUser,
        })
        .code(200);
    }

    return h
      .response({ success: false, message: "user not found to delete" })
      .code(404);
  } catch (error) {
    console.log(error.message);
  }
};

const addedUser = async (req, h) => {
  try {
    let {name, email} = req.payload;
    let isUser = await findUserByEmail(req.payload);

    if (!isUser) {
      await createUser(req.payload);
      await sendMail(name, email);
      return h
        .response({ success: true, message: "user created successfully" })
        .code(200);
    }

    return h
      .response({
        success: false,
        message: "user already exists with that email"
      })
      .code(404);
  } catch (error) {
    console.log(error.message);
  }
};

const loggedinUser = async (req, h) => {
  try {
    let { email, dept } = req.payload;
    let user = await findUserByEmail({ email });
    console.log(user);

    if (!user || dept !== user.dept) {
      return h
        .response({ success: false, message: "invalid credentials" })
        .code(401);
    }

    let token = jwt.token.generate(
      {
        email: user.email,
        dept: user.dept,
        exp: Math.floor(Date.now() / 1000) + 60 * 60,
      },
      process.env.JWT_SECKEY
    );
    console.log(token);

    return h.response({
      success: true,
      message: "logged in successfully",
      data: token,
    });
  } catch (error) {
    console.log(error.message);
  }
};

const signupedUser = async (req, h) => {
  try {
    let {name, email } = req.payload;
    let isUser = await findUserByEmail(email);

    if (isUser) {
      return h
        .response({ success: false, message: "user already exits" })
        .code(403);
    }

    let user = await createUser(req.payload);

    await fanoutExg(name, email)
    return h
      .response({ success: true, message: "singupedd successfully" })
      .code(200);
    
  } catch (error) {
    console.log(error.message);
    return h
    .response({ success: false, message: "Internal server error" })
    .code(500);
  }
};

module.exports = {
  alluser,
  singleUser,
  updatedUser,
  deletedUser,
  addedUser,
  loggedinUser,
  signupedUser,
};

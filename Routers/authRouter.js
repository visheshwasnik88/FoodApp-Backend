const express = require("express");
const app=express()
const cookieParser=require('cookie-parser');
app.use(cookieParser())
const authRouter = express.Router();
const userModel = require("../models/userModel");
const jwt=require('jsonwebtoken');
//Signup
authRouter
.route("/signup")
.get(middleware, getSinguUp)
.post(postSignup);

// Login
authRouter
.route("/login")
.post(loginUser);

//Auth functions

function middleware(req, res, next) {
  next();
}
function getSinguUp(req, res) {
  res.sendFile("./public/index.html", { root: __dirname });
}
async function postSignup(req, res) {
  let data = req.body;
  let user = await userModel.create(data);
  //console.log(data)
  res.json({
    message: "user signedup",
    Data: user,
  });
}


// secret key
const JWT_key='asgdgwgg3g3g'
async function loginUser(req, res) {
  try {
    let data = req.body;
    if (data.email) {
      let user = await userModel.findOne({ email: data.email });
      if (user) {
        if (user.password == data.password) {
            let uid=user['_id'];
            let JWT=jwt.sign({payload:uid},JWT_key)
            console.log(JWT)
            res.cookie('isLoggedIn',JWT);
          return res.json({
            message: "User has loggedIn",
            userDetails: data,
          });
        } else {
          return res.json({
            message: "Wrong Credentials",
          });
        }
      } else {
        return res.json({
          message: "User not found!",
        });
      }
    } else {
      return res.json({
        message: "Please enter email",
      });
    }
  } catch (err) {
    return res.status(400).json({
      message:err.message,
    });
  }
}
module.exports = authRouter;

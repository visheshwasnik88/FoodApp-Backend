const express = require("express");
const app = express();
const userModel = require("../models/usermodel");
const Cookies = require("cookie-parser");
const {sendMail}=require("../utility/nodemailer")
//app.use(Cookies);
const jwt = require("jsonwebtoken");
module.exports.signUp = async function signUp(req, res) {
  try {
    let data = req.body;
    let user = await userModel.create(data);
    sendMail("singup",user)
    if (user) {
      return res.json({
        message: "User Signedup",
        data: user,
      });
    } else {
      return res.json({
        message: "error while signup",
      });
    }
  } catch (err) {
    res.json({
      message: err.message,
    });
  }
};

const JWT_key = "asgdgwgg3g3g";
module.exports.login = async function login(req, res) {
  // passing jwt as a response
  try {
    let data = req.body;
    if (data.email ) {
      let user = await userModel.findOne({ email: data.email });
      if (user) {
        let passwordMatch=user.passwordCheck(user.password,data.password)
        if (passwordMatch) {
          let uid = user["_id"];
          //jwt created
          let JWT = jwt.sign({ payload: uid }, JWT_key);
          res.cookie("login", JWT);
          return res.json({
            message: "User has loggedIn",
            data:user
          });
        } else {
          return res.json({
            message: "Wrong Credentials",
          });
        }
      } else {
        return res.json({
          message: "Please enter email",
        });
      }
    }
  } catch (err) {
    return res.status(400).json({
      message: err.message,
    });
  }
};

module.exports.logout = function logout(req,res) {
  // Destroying jwt to logout
  res.cookie("login", " ", { maxAge: 1 });
  res.json({
    message: "User logout",
  });
};

//to check user roles
module.exports.isAuthorised = function isAuthorised(roles) {
  return function (req, res, next) {
    if (roles.includes(req.role) == true) {
      next();
    } else {
      return res.status(401).json({
        message: "Operation not allowed",
      });
    }
  };
};

module.exports.protectRoute = async function protectRoute(req, res, next) {
  try {
    let tooken;
    if (req.cookies.login) {
      tooken = req.cookies.login;
      // verifying jwt
      let payload = jwt.verify(tooken, JWT_key);
      if (payload) {
        const user = await userModel.findById(payload.payload);
        req.role = user.role;
        req.id = user.id;
        next();
      }
    } else {
      return res.json({
        message: "please login again",
      });
    }
  } catch (err) {
    res.json({
      message: err.message,
    });
  }
};

module.exports.forgetpassword = async function forgetpassword(req, res) {
  const { email } = req.body;
  try {
    const user = await userModel.findOne({ email: email });
    if (user) {
      // instance method
      const resetToken = user.createResetToken();
      // http:abc.com/resetPassword/token
      const resetPasswordLink = `${req.protcol}://${req.get("host")}/resetpassword/${resetToken}`;
      // send email to the user
      // nodemailer
      let obj={
        resetPasswordLink:resetPasswordLink,
        email:email
      }
      sendMail("resetpassword",obj)
    } else {
      return res.json({
        message: "Please signup",
      });
    }
  } catch (err) {
    return res.json({
      message: err.message,
    });
  }
};

module.exports.resetpassword = async function resetpassword(req, res) {
  let token = req.params.token;
  let { password, confirmpassword } = req.body;
  try {
    let user = await userModel.findOne({ resetToken: token });
    if (user) {
      user.resetPasswordHandler(password, confirmpassword);
      await user.save();
      res.json({
        message: "password reset successfully",
      });
    } else {
      return res.json({
        message: "no user found",
      });
    }
  } catch (err) {
    return res.json({
      message: err.message,
    });
  }
};

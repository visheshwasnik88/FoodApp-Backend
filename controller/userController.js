//  User fuctions
const express=require('express');
const app=express()
app.use(express.json())
const userModel = require("../models/userModel");
module.exports.getUser = async function getUser(req, res) {
  let id = req.id;
  //console.log(id);
  let user = await userModel.findById(id);
  if (user) {
    return res.json(user);
  } else {
    return res.json({
      message: "User not found.",
    });
  }
};

module.exports.updateUser = async function updateUser(req, res) {
  try {
    let id = req.params.id;
    let dataToUpdated = req.body;
    let user = await userModel.findById(id);
    // console.log(user)
    // console.log(dataToUpdated)
    if (user) {
      let keys = [];
      for (let key in dataToUpdated) {
        keys.push(key);
      }
      for (let i = 0; i < keys.length; i++) {
        user[keys[i]] = dataToUpdated[keys[i]];
      }
      let updatedData = await user.save();
      res.json({
        message: "User updated!",
        UpdatedData: updatedData,
      });
    } else {
      return res.json({
        message: "User not found!",
      });
    }
  } catch (err) {
    return res.json({
      message: err.message,
    });
  }
  
}
module.exports.deleteUser = async function deleteUser(req, res) {
  try {
    let id = req.params.id;
    let data = await userModel.findByIdAndDelete(id);
    if (!data) {
      return res.json({
        message: "No data found to delete!",
      });
    }
    res.json({
      message: "User deleted!",
    });
  } catch (err) {
    return res.json({
      message: err.message,
    });
  }
};
module.exports.getAllUsers = async function getAllUsers(req, res) {
  let users = await userModel.find();
  if (users) {
    res.json({
      message: "users received",
      Users: users,
    });
  } else {
    res.json({
      message: "something went wrong",
    });
  }
};

module.exports.updateProfileImage=function updateProfileImage(req,res){
  res.json({
    message:'profile updated'
  })
}


const mongoose = require("mongoose");
// Hashing
const bcrypt = require("bcryptjs");
const db_link= require('../secret')
mongoose
  .connect(db_link)
  .then(function () {
    console.log("user db connected");
  })
  .catch(function (err) {
    console.log(err);
  });

//Schema

const userSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  email: {
    type: String,
    required: true,
    unique: true,
  },
  password: {
    type: String,
    required: true,
    min: 8,
  },
  confirmpassword: {
    type: String,
    min: 8,
    validate: function () {
      return this.password === this.confirmpassword;
    },
  },
  role: {
    type: String,
    enum: ["admin", "user", "restaurantowner", "deliveryBoy"],
    default: "user",
  },
  profileImage: {
    type: String,
    default: "img/users/default.jpg"
  },
  resetToken: { type: String },
});

userSchema.pre("save", async function () {
  this.confirmpassword = undefined;

  //1. create salt
  //2. genreate hashed string

  //let salt=await bcrypt.genSalt();
  let hashedString = await bcrypt.hash(this.password, 8);
  //console.log(hashedString)
  this.password = hashedString;
});

// Instance methods
userSchema.methods.passwordCheck = async function (userPassword, dataPassword) {
  let isMatch = await bcrypt.compare(userPassword, dataPassword);
  // console.log(isMatch)
  return isMatch;
};

userSchema.methods.createResetToken = function () {
  const resetToken = crypto.randomBytes(32).toString("hex");
  this.resetToken = resetToken;
  return resetToken;
};

userSchema.methods.resetPassword = function (password, confirmpassword) {
  this.password = password;
  this.confirmpassword = confirmpassword;
  this.resetToken = undefined;
};

//model
const userModel =
  mongoose.models.userModel || mongoose.model("userModel", userSchema);
module.exports = userModel;

// async function creatuser(){

//     let user={
//         name:'Abhi',
//         email:'abc@gmail.com',
//         password:12345678,
//         confirmpassword:12345678
//     }
//     let data= await userModel.create(user);
//     console.log(data)
// };

// creatuser().then(function(){
//     console.log('solved')
// }).catch(function(err){
//     console.log(err)
// })

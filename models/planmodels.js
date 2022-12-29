// model for plans
const mongoose = require("mongoose");
const db_link= require('../secret')
mongoose.connect(db_link).then(function () {
    console.log("plans db connected");
  }).catch(function (err) {
    console.log(err);
  });

const planSchema= new mongoose.Schema({
  name:{
    type:'String',
    required:true,
    unique:true,
    maxlength:[20,'Plan name should not exceed more than 20 char']
  },
  duration:{
    type:Number,
    required:true
  },
  price:{
    type:Number,
    required:[true,'Please enter price']
  },
  ratingsAverage:{
    type:Number
  },
  reviews: {
    //   array of object id 
    type: [mongoose.Schema.ObjectId],
    ref:"reviewModel"
},
  discount:{
    type:Number,
    validate: [function(){
      return this.discount < 100
    },'discount should not exceed price']
  }
})

 const planModel= mongoose.model('planModel',planSchema);
 module.exports=planModel

const express=require('express')
const app= express()
const bookingRouter=express.Router()
const {protectRoute}=require('../controller/authContoller')
const {createSession}=require('../controller/bookingController')
bookingRouter
.route('/createSession')
.post(createSession)
.get(function(res,res){
    res.sendFile("C:/Users/vishesh wasnik/Desktop/PepYt-Backend/Express/booking.html")
})
module.exports=bookingRouter
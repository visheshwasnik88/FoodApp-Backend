const express = require("express");
const app = express();
const cors=require('cors')
const cookieParser=require('cookie-parser');
app.use(cookieParser());
app.use(cors({
  origin:"http://localhost:3000",
  credentials:true
}))
const port='5000'
app.listen(port, function () {
  console.log("server is listening on port 5000");
});
app.use(express.json());


const userRouter = require("./Routers/userRouter");
const planRouter=require('./Routers/planRouter')
const reviewRouter=require('./Routers/reviewRouter')
const bookingRouter=require('./Routers/bookingRouter')
//userRouter
app.use("/user", userRouter);
//plansRouter
app.use("/plans",planRouter)
//reviewRouter
app.use("/review",reviewRouter)
//Booking
app.use('/booking',bookingRouter)

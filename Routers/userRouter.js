const express=require('express')
const cookieParser=require('cookie-parser');
const app=express()
//Cookies
app.use(cookieParser());
const multer=require('multer');
const userRouter=express.Router()
//const protectRoute=require('./authHelper')
const {getUser,getAllUsers,updateUser,deleteUser,updateProfileImage}=require('../controller/userController')
const {login,signUp,isAuthorised,protectRoute,forgetpassword,resetpassword,logout}=require('../controller/authContoller')


//auth specific functions

userRouter
.route('/signup')
.post(signUp)

userRouter
.route('/login')
.post(login)

userRouter
.route('/forgetpassword')
.post(forgetpassword)

userRouter
.route('/resetpassword/:token')
.post(resetpassword)

const multerStorage=multer.diskStorage({
    destination:function(req,file,cb){
        cb(null,'public/Images');
    },
    filename:function(req,file,cb){
        cb(null,`user-${Date.now()}.jpeg`);
    }
})
const filter=function(req,file,cb){
    if(file.mimetype.startsWith("image")){
        cb(null,true)
    }else{
        cb(new Error("Not an image ! Please select the image"),false)
    }
}

const upload=multer({
    storage:multerStorage,
    fileFilter:filter
})

userRouter
.route('/ProfileImage')
.get(function(req,res){
    res.sendFile('C:/Users/vishesh wasnik/Desktop/PepYt-Backend/Express/multer.html')
})
.post(upload.single('photo'),updateProfileImage)

userRouter
.route('/:id')
.patch(updateUser)
.delete(deleteUser)

//profile specific user
userRouter.use(protectRoute)
userRouter
.route('/userProfile')
.get(getUser)


// get user
userRouter.use(isAuthorised(['admin']))
userRouter
.route('/')
.get(getAllUsers)

userRouter
.route('/logout')
.get(logout)











module.exports=userRouter

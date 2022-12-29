
const jwt=require('jsonwebtoken')
// secret key
const JWT_key='asgdgwgg3g3g'
function protectRoute(req,res,next){
    let cookies=req.cookies.isLoggedIn
    console.log(cookies)
    next()
//  if(req.cookies.LoggedIn){
//    let isverified=jwt.verify(req.cookies.LoggedIn,JWT_key)
//    if(isverified){
//     next()
//    }else{
//     return res.json({
//         message:'user not veried'
//     })
//    }
//  }else{
//     return res.json({
//         message:'operation not allowed'
//     })
 }
    


module.exports=protectRoute
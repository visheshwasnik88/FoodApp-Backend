const express=require('express')
const app=express()
const {protectRoute} = require('../controller/authContoller')
const reviewRouter=express.Router()
const {getAllReviews,top3Reviews,getPlanReiew,createReiew,updateReview,deleteReview}=require('../controller/reviewController')

reviewRouter
.route('/all')
.get(getAllReviews)

reviewRouter
.route('/top3')
.get(top3Reviews)

reviewRouter
.route('/:id')
.get(getPlanReiew)

//reviewRouter.use(protectRoute)
reviewRouter
.route('/crud/:id')
.post(createReiew)

// reviewRouter
// .route('crud/:id')
.patch(updateReview)
.delete(deleteReview)
module.exports=reviewRouter
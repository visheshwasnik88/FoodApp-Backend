const reviewModel = require("../models/reviewmodel");
const planModel = require("../models/planmodels");

module.exports.getAllReviews = async function getAllReviews(req, res) {
  try {
    let allreviews = await reviewModel.find();
    if (allreviews) {
      return res.json({
        message: "reviews retrieved",
        Data: allreviews,
      });
    } else {
      return res.json({
        message: "No review found",
      });
    }
  } catch (err) {
    return res.json({
      message: err.message,
    });
  }
};
module.exports.top3Reviews = async function top3Reviews(req, res) {
  try {
    let top3reviews = await reviewModel.find().sort({ rating: -1 }).limit(3);
    if (top3reviews) {
      return res.json({
        message: "review retrived",
        Data: top3reviews,
      });
    } else {
      return res.json({
        message: "no review found",
      });
    }
  } catch (err) {
    return res.json({
      message: err.message,
    });
  }
};

module.exports.getPlanReiew = async function getPlanReiew(req, res) {
  
    try{
      const planid=req.params.id;
      console.log("plan id",planid);
      let reviews=await reviewModel.find();
  
      reviews=reviews.filter(review=>review.plan["_id"]==planid);
      // console.log(reviews);
      return res.json({
        data:reviews,
        message:'reviews retrieved for a particular plan successful'
      });
    }
    catch(err){
      return res.json({
        message:err.message
    });
    }
}

  

module.exports.createReiew = async function (req, res) {
  try {
    let data=req.body
    //console.log('95',data)
   let planId=data.plan
    let review = await reviewModel.create(data);
    // plan -> reviewId
   console.log('98',review)
     let plan = await planModel.findById(planId);
     plan.reviews.push(review["_id"]);
    //  plan: average rating update
    if (plan.averageRating) {
      let sum = plan.averageRating * plan.reviews.length;
      let finalAvgRating = (sum + review.rating) / (plan.reviews.length + 1);
     plan.averageRating = finalAvgRating;
     } else {
       plan.averageRating = review.rating;
     }
     await plan.save();
    return  res.status(200).json({
      message: "review created",
      review: review,
    });
  } catch (err) {
    res.status(500).json({
      message: err.message,
    });
  }
};

module.exports.deleteReview = async function (req, res) {
  try {
    let id=req.body.id
    let review = await reviewModel.findByIdAndDelete(id);
   let planId = review.plan.id;
   let plan = await planModel.findById(planId);
  let idxOfReview = plan.reviews.indexOf(review["_id"]);
   //console.log(idxOfReview)
    plan.review.splice(idxOfReview, 1);
    await plan.save();
  // console.log(plan)
    res.status(200).json({
      message: "review deleted",
      review: review,
    });
  } catch (err) {
    res.status(500).json({
      message: err.message,
    });
  }
};
module.exports.updateReview = async function (req, res) {
  try {
    //which plan's review is being updated
    let id = req.params.id; //which review needs to be updated
    let dataToBeUpdated = req.body;
    let keys = [];
    for (let key in dataToBeUpdated) {
      keys.push(key);
    }
    // key.include("rating")
    //use review's rating to calculate avg rating and update in plan
    let review = await reviewModel.findById(id);
    for (let i = 0; i < keys.length; i++) {
      review[keys[i]] = dataToBeUpdated[keys[i]];
    }
    await review.save();
    return res.json({
      message: "plan updated succesfully",
      review,
    });
  } catch (err) {
    return res.json({
      msg: err.message,
    });
  }
};

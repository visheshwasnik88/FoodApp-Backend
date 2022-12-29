const planModel = require("../models/planmodels");

module.exports.getAllPlans = async function getAllPlans(req, res) {
  try {
    let allPlans = await planModel.find();
    //console.log(allPlains)
    if (allPlans) {
      return res.json({
        message: "all plans received",
        data: allPlans,
      });
    } else {
      return res.json({
        message: "plans not found",
      });
    }
  } catch (err) {
    return res.status(500).json({
      message: err.message
    });
  }
};

module.exports.getPlan = async function getPlan(req, res) {
  let id = req.params.id;
  // getting specific plan
  try {
    let plan = await planModel.findById(id);
  // console.log('plan',plan)
    if (plan) {
      return res.json({
        message: "plan received",
        Plan: plan,
      });
    } else {
      return res.json({
        message: "plan not found",
      });
    }
  } catch (err) {
    return res.status(500).json({
      message: err.message,
    });
  }
};

module.exports.createPlan = async function createPlan(req, res) {
  let planData = req.body;

  try {
    let createPlan = await planModel.create(planData);
    if (createPlan) {
      return res.json({
        message: "plan created succesfully",
        Plan: createPlan,
      });
    }
  } catch (err) {
    return res.json({
      message: err.message,
    });
  }
};

module.exports.deletePlan = async function deletePlan(req, res) {
  let id = req.params.id;
  try {
    let plan = await planModel.findByIdAndDelete(id);
    if (plan) {
      return res.json({
        message: "Plan deleted",
      });
    }
  } catch (err) {
    return res.status(500).json({
      message: err.message,
    });
  }
};

module.exports.updatePlan = async function updatePlan(req, res) {
  let id = req.params.id;
  console.log(id)
  let dataToUpdate = req.body;
  //console.log('line83',dataToUpdate)
  try {
    let plan = await planModel.findById(id);
    if (plan) {
      let keys = [];
      for (let key in dataToUpdate) {
        keys.push(key);
      }
      for (let i = 0; i < keys.length; i++) {
        plan[keys[i]] = dataToUpdate[keys[i]];
      }
      let updatedPlan = await plan.save();
      res.json({
        message: "Plan updated successfully",
        Plan: updatedPlan,
      });
    } else {
      return res.json({
        message: "No plan found.",
      });
    }
  } catch (err) {
    return res.status(500).json({
      message: err.message,
    });
  }
};

module.exports.top3Plans = async function top3Plans(req, res) {
  //console.log('plan')
  let Plans = await planModel.find().sort({ ratingsAverage: -1 }).limit(3);
  if (Plans) {
    return res.json({
      message: "Top 3 Plans received",
      Plans: Plans,
    });
  }
};

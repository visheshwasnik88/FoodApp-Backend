const express = require("express");
//const app=express()
const { isAuthorised, protectRoute } = require("../controller/authContoller");
const planRouter = express.Router();

const {getAllPlans,getPlan,createPlan,deletePlan,updatePlan,top3Plans} = require("../controller/planController");
//const planModel = require("../models/planmodels");

planRouter
.route("/top3")
.get(top3Plans);

// shows all plans
planRouter
.route("/allplans")
.get(getAllPlans);

// loggedIn to get your own plan
planRouter.use(protectRoute);
planRouter
.route("/plan/:id")
.get(getPlan);

//admin and owner can only create,update,delete plan
planRouter.use(isAuthorised(["admin", "restaurantowner"]));
planRouter
.route("/crudPlan")
.post(createPlan);

planRouter
.route("/crudPlan/:id")
.patch(updatePlan)
.delete(deletePlan);

// planRouter
//.route('/crudPlan/:id')

module.exports = planRouter;


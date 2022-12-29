// This is your test secret API key.
const SK =
  "sk_test_51MG0hFSIXhbFXvw6XyllXfs4cmzwQp14KAD3mYqetiWAbKxRLaX7Nkvshu2R1eZE8uuRk3AnCEjA8eGKCnQ0SUnQ00eA6JbLB1";
const stripe = require("stripe")(SK);
const express = require("express");
const app = express();
const planModel = require("../models/planmodels");
const userModel = require("../models/usermodel");
app.use(express.static("public"));

//const YOUR_DOMAIN = 'http://localhost:4242';

module.exports.createSession = async function createSession(req, res) {
 try{
  const userId = req.id;
  const planId = req.params.id;
  const user = await userModel.findById(userId);
  const plan = await planModel.findById(planId);

  const session = await stripe.checkout.sessions.create({
    payment_method_types: ["card"],
    customer_email: user.email,
    client_refernce_id: plan.id,
    line_items: [
      {
        name: plan.name,
        description: plan.description,
        amount: plan.price * 100,
        currency: "inr",
        quantity: 1,
        // Provide the exact Price ID (for example, pr_1234) of the product you want to sell
        // price: '{{PRICE_ID}}',
      },
    ],
    // mode: 'payment',
    success_url: `${req.protocol}://${req.get("host")}/profile`,
    cancel_url: `${req.protocol}://${req.get("host")}/profile`,
  });
  res.status(200).json({
    status: "success",
    session,
  });
 }catch(err){
    res.status(500).json({
      message:err.message
    })
 }
};

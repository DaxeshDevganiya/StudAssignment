const User=require("../Models/UserModel");
const jwt = require('jsonwebtoken');
const sgMail = require('@sendgrid/mail')
const env=require('dotenv').config();
sgMail.setApiKey(process.env.SENDGRID_API_KEY)
require('dotenv').config();
const Stripe = require('stripe');
var FCM = require("fcm-node");
const serverKey=require("../serviceAccountKey.json");



const nodemailer = require("nodemailer");

module.exports=async(req,res)=>{

    try{
        
        
        const JwtToken = req.header('Authorization');
        const decoded = jwt.verify(JwtToken, 'assignment');
        const sid = decoded.userId;
        
  
        const { emailNoti,InappNoti} = req.body;
        console.log(emailNoti);
        const user=await User.findOne({_id:sid});
        // console.log(user)
          if(user){
            user.emailNotification=emailNoti;
            user.InAppNotification=InappNoti;
            user.save();
          }
          
          res.status(200).json({"message":"Saved Notification Preferences","status":200});
        }        
       
    catch(error){
        console.log(error);
        res.status(400).json({"message":error,"status":400});
    }
}
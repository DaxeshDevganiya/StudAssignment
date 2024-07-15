const Assignment=require("../Models/AssignmentModel");
const AssignAssignments=require("../Models/AssignAssignments");
const User=require("../Models/UserModel");
const multer = require('multer');
const jwt = require('jsonwebtoken');
const sgMail = require('@sendgrid/mail')
const env=require('dotenv').config();
sgMail.setApiKey(process.env.SENDGRID_API_KEY)

const moment = require('moment');

const Stripe = require('stripe');
const stripe = new Stripe('sk_test_51OyfljGQ4hnFke5n7hOj6jngpiK4Vs0SsjYxwwnisDBn0Co8qnBJwx4I2rz90cD4P70H3YN5lGdxwp2LxiXX65lu00vDXvCmam');

const nodemailer = require("nodemailer");

module.exports=async(req,res)=>{
    
    try{
        
        const{performanceRating,FeedbackMessage}=req.body
        const JwtToken = req.header('Authorization');
        const decoded = jwt.verify(JwtToken, 'assignment');
        const sid = decoded.userId;
        // const solver=await User.find({industry:industry});
        
      
        // const user=await User.find({industry:industry});
        const aid=req.params.aid;
        const feedback= await AssignAssignments.findOne({_id:aid,sid:sid})

        // if(postSolverAssignment.isUploaded==1){
        //     res.status(400).json({"message":"No Assignment Found","status":"400"})
        // }
        
        
        
      
        if(feedback){
            feedback.performanceRating= performanceRating
            feedback.FeedbackMessage=FeedbackMessage
                // const msg = {
                //   to: student['email'], // Change to your recipient
                //   from: "Assignment@my7wish.com", // Change to your verified sender
                //   subject: 'Sending with SendGrid is Fun',
                //   text: 'Solver Uploaded Assignment ',
                //   html: 'Solver Uploaded Assignment',
                // }
                // sgMail
                //   .send(msg)
                //   .then(() => {
                //     console.log('Email sent')
                //   })
                //   .catch((error) => {
                //     console.error(error)
                //   })
                
                feedback.save();
                res.status(200).json({"message":" Feedback Sent successfully..","status":200})
           
        }
        else{
            res.status(400).json({"message":" Something went wrong ..","status":400})
        }
    }catch(error){
        console.log(error);
        res.status(500).json({"message":error,"status":500});
    }
}
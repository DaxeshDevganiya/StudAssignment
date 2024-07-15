const Assignment=require("../Models/AssignmentModel");
const AssignAssignments=require("../Models/AssignAssignments");
const User=require("../Models/UserModel");
const multer = require('multer');
const jwt = require('jsonwebtoken');
const sgMail = require('@sendgrid/mail')
require('dotenv').config();
sgMail.setApiKey(process.env.SENDGRID_API_KEY)

const moment = require('moment');

const Stripe = require('stripe');
const stripe = new Stripe(process.env.Stripe_API);
const { google } = require("googleapis");
const axios = require("axios");
const SCOPES = "https://www.googleapis.com/auth/firebase.messaging";

const nodemailer = require("nodemailer");

module.exports=async(req,res)=>{
    
    try{
      const getAccessToken = () => {
        return new Promise(function (resolve, reject) {
          const key = require("../googleKey.json");
          const jwtClient = new google.auth.JWT(
            key.client_email,
            null,
            key.private_key,
            SCOPES,
            null
          );
          jwtClient.authorize(function (err, tokens) {
            if (err) {
              reject(err);
              return;
            }
            resolve(tokens.access_token);
          });
        });
      };
      
      
      const AxiosConfig = async (token, notification) => {
        try {
          let config = {
            method: "post",
            url: "https://fcm.googleapis.com/v1/projects/studentside-12e0e/messages:send",
            headers: {
              Authorization: `Bearer ${token}`,
              "Content-Type": "application/json",
            },
            data: notification,
          };
      
          const response = await axios(config);
      
          return response;
        } catch (error) {
          console.error("Error sending notification:", error.message);
          throw error;
        }
      };
        
        
        const JwtToken = req.header('Authorization');
        const decoded = jwt.verify(JwtToken, 'assignment');
        const sid = decoded.userId;
        // const solver=await User.find({industry:industry});
        
       
        // const user=await User.find({industry:industry});
        const aid=req.params.aid;
        const postSolverAssignment= await AssignAssignments.findOne({_id:aid,solveid:sid})

        // if(postSolverAssignment.isUploaded==1){
        //     res.status(400).json({"message":"No Assignment Found","status":"400"})
        // }
        
        const student=await User.findOne({_id:postSolverAssignment['sid']});
        console.log({student:student})
        const deadline=moment(postSolverAssignment.deadlineDate)
        const currentDate=moment()
      
        if(currentDate.isBefore(deadline)){
            postSolverAssignment.uploadedFiles=req.file.filename
            postSolverAssignment.isUploaded=1
            if(student.emailNotification=="true"){
              const msg = {
                to: student['email'], // Change to your recipient
                from: "Assignment@my7wish.com", // Change to your verified sender
                subject: 'Sending with SendGrid is Fun',
                text: 'Solver Uploaded Assignment ',
                html: `<div style="font-family: Helvetica,Arial,sans-serif;min-width:1000px;overflow:auto;line-height:2">
                <div style="margin:50px auto;width:70%;padding:20px 0">
                  <div style="border-bottom:1px solid #eee">
                    <a href="" style="font-size:1.4em;color: #00466a;text-decoration:none;font-weight:600">Task System</a>
                  </div>
                  <h2 style="color: #333;">Assignment Added</h2>
                  <p style="color: #666;">Dear ${student['firstname']}</p>
                  <p style="color: #666;">Solver just uploaded your assignment to your portal.</p>
                  <p style="color: #666;">Please login to your account to view the details.</p>
                  <p style="color: #666;">Thank you!</p>
                  <hr style="border:none;border-top:1px solid #eee" />
                  <div style="float:right;padding:8px 0;color:#aaa;font-size:0.8em;line-height:1;font-weight:300">
                    <p>Task System Inc</p>
                  
                  </div>
                </div>
              </div>`,
              }
              sgMail
                .send(msg)
                .then(() => {
                  console.log('Email sent')
                })
                .catch((error) => {
                  console.error(error)
                })
            }
            if(student.InAppNotification=="true"){
              const access_token = await getAccessToken();
              var notification = JSON.stringify({
                  message: {
                    token:student.fcmToken, // this is the fcm token of user which you want to send notification
                    notification: {
                      body: "Solver Uploaded your Assignment  in your portal",
                      title: "Assignment Uploaded in your portal",
                    },
                    apns: {
                      headers: {
                        "apns-priority": "10",
                      },
                      payload: {
                        aps: {
                          sound: "default",
                        },
                      },
                    },
                    data: {
                      productId: "ProductId", // here you can send addition data along with notification 
                    },
                  },
                })
                try {
                  let response = await AxiosConfig(access_token, notification);
                } catch (error) {
                  console.log("error", error.message);
                }
                       
            }
               
                
                postSolverAssignment.save();
                res.status(200).json({"message":" Uploaded..","status":200})
           
        }else if(currentDate.isAfter(deadline)){
            res.status(400).json({"message":"Assignment is closed you missed the deadline","status":400})
        }
        else{
            res.status(400).json({"message":" Something went wrong ..","status":400})
        }
    }catch(error){
        console.log(error);
        res.status(500).json({"message":error,"status":500});
    }
}
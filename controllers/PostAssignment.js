const Assignment=require("../Models/AssignmentModel");
const AssignAssignments=require("../Models/AssignAssignments");
const User=require("../Models/UserModel");
const multer = require('multer');
const { getMessaging } = require( "firebase-admin/messaging");
const admin = require("firebase-admin");
const jwt = require('jsonwebtoken');
const sgMail = require('@sendgrid/mail')
const env=require('dotenv').config();
sgMail.setApiKey(process.env.SENDGRID_API_KEY)
require('dotenv').config();
const Stripe = require('stripe');
var FCM = require("fcm-node");
const serverKey=require("../serviceAccountKey.json");
var fcm = new FCM(serverKey);
const stripe = new Stripe
('sk_test_51OyfljGQ4hnFke5n7hOj6jngpiK4Vs0SsjYxwwnisDBn0Co8qnBJwx4I2rz90cD4P70H3YN5lGdxwp2LxiXX65lu00vDXvCmam');
const { google } = require("googleapis");
const axios = require("axios");
const SCOPES = "https://www.googleapis.com/auth/firebase.messaging";

const nodemailer = require("nodemailer");

module.exports=async(req,res)=>{

  const getAccessToken = () => {
    return new Promise(function (resolve, reject) {
      const key = require("../solversideGoogleKey.json");
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
        url: "https://fcm.googleapis.com/v1/projects/solverside-6dd9e/messages:send",
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
  
  
 
    
    try{
        
        
        const JwtToken = req.header('Authorization');
        const decoded = jwt.verify(JwtToken, 'assignment');
        const sid = decoded.userId;
        
  
        const { assignmentName,deadlineDate,price,industry} = req.body;
        const user=await User.find({industry:industry,role:"solver"});
        // console.log(assignmentName)
       
        if(req.body.price<=10){
            return res.status(403).json({"message":"Price Must be Greater than 10","status":"403"});
        }
        const assignments= await AssignAssignments.find({sid:sid});
        let companyPercentage=0.25;
        if(assignments.length>10){
          companyPercentage=0.15
        }else if(assignments.length>20){
          companyPercentage=0.05
        }
            const studPrice=price;
        const companyPrice=price*companyPercentage;
        const solverPrice= price-companyPrice;
        
        
          const postAssignment= new Assignment({sid,assignmentName,deadlineDate,price:studPrice,solverPrice:solverPrice,companyPrice:companyPrice,files:req.file.filename,industry,minPrice:10,active:0})
          if(postAssignment){
            
          
    for(var i=0;i<user.length;i++){
      const access_token = await getAccessToken();
      if(user[i].InAppNotification=='true'){
        var notification = JSON.stringify({
          message: {
            token:user[i].fcmToken, // this is the fcm token of user which you want to send notification
            notification: {
              body: "Assignment Uploaded in your portal",
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
      if(user[i].emailNotification=='true'){
        const msg = {
          to: user[i]['email'], // Change to your recipient
          from: "Assignment@my7wish.com", // Change to your verified sender
          subject: 'Sending with SendGrid is Fun',
          text: 'Assignment Added in your portal',
          html: `<div style="font-family: Helvetica,Arial,sans-serif;min-width:1000px;overflow:auto;line-height:2">
          <div style="margin:50px auto;width:70%;padding:20px 0">
            <div style="border-bottom:1px solid #eee">
              <a href="" style="font-size:1.4em;color: #00466a;text-decoration:none;font-weight:600">Task System</a>
            </div>
            <h2 style="color: #333;">Assignment Added</h2>
            <p style="color: #666;">Dear ${user[i]['firstname']},</p>
            <p style="color: #666;">An assignment has been added to your portal.</p>
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
  
     
      // getMessaging().send(Message)
      // .then((response) => {
      //   // Response is a message ID string.
      //   console.log('Successfully sent message:', response);
      // })
      // .catch((error) => {
      //   console.log('Error sending message:', error);
      // });
      // console.log(user)
  
  }
              postAssignment.save();
              const assign=new AssignAssignments({sid:sid,solveid:"-",assignmentName,deadlineDate,price:studPrice,solverPrice:solverPrice,companyPrice:companyPrice,minPrice:10,files:req.file.filename,industry,active:0})
              assign.save();
          }
          
          res.status(200).json({"message":"Assignment added successfully","status":200});
        }        
       
    catch(error){
        console.log(error);
        res.status(400).json({"message":error,"status":400});
    }
}
const User=require("../Models/UserModel");
const bcrypt=require("bcrypt");
const jwt = require('jsonwebtoken');
const nodemailer = require("nodemailer");

const sgMail = require('@sendgrid/mail')
sgMail.setApiKey(process.env.SENDGRID_API_KEY)
require('dotenv').config;



module.exports=async(req,res)=>{
  
    try{
       const{email,contact}=req.body;
        const user=await User.findOne( { $or: [ { email }, { contact} ] } )
        const oldotp="";
      
        const min = 100000; 
                    const max = 999999; 
                    const otp= Math.floor(Math.random() * (max - min + 1)) + min;
                   
        if(user){
            const matchPassword=await bcrypt.compare(req.body.password,user.password);
            if(matchPassword){
                user.loginOtp=oldotp;
                user.loginOtp=otp;
                    user.save();
    // const transporter = nodemailer.createTransport({
    //     service: "gmail",
    //     // port: 587,
    //     // secure: false, // Use `true` for port 465, `false` for all other ports
    //     auth: {
    //       user: "tasksystem2024@gmail.com",
    //       pass: "cguoodbjkmlarbkn",
    //     },
    //   })
    //   const info = await transporter.sendMail({
    //     from: 'tasksystem2024@gmail.com', // sender address
    //     to: user['email'], // list of receivers
    //     subject: "Otp for login", // Subject line
    //     text: "You have new Assignment in your portal", // plain text body
    //     html: "<b>Your Otp for login is </b>:"+otp, // html body
    //   });
    const msg = {
        to:user['email'],
        from: "Otp@my7wish.com", 
        subject: 'Sending with SendGrid is Fun',
        text: 'Assignment Added in your portal',
        html: `<div style="font-family: Helvetica,Arial,sans-serif;min-width:1000px;overflow:auto;line-height:2">
        <div style="margin:50px auto;width:70%;padding:20px 0">
          <div style="border-bottom:1px solid #eee">
            <a href="" style="font-size:1.4em;color: #00466a;text-decoration:none;font-weight:600">Task System</a>
          </div>
          <p style="font-size:1.1em">Hi, ${user['firstname']}</p>
          <p>Thank you for choosing Task System. Use the following OTP to complete your Sign Login procedures. OTP is valid for 5 minutes</p>
          <h2 style="background: #2196F3;margin: 0 auto;width: max-content;padding: 0 10px;color: #fff;border-radius: 4px;">${otp}</h2>
          <p style="font-size:0.9em;">Regards,<br />Task System</p>
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
      
                res.status(200).json({ "message":"Otp sent Successfully","status":200,"otp":otp,"user":user });
              
                   
            }else{
                res.status(401).json({"message":"password wrong","status":401});
            }
        }else{
            res.status(400).json({"message":"User not exist","status":400});
        }
    }catch(error){
        console.log(error);
        res.status(500).json({"message":error,"status":500});
    }
}
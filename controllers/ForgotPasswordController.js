const User=require("../Models/UserModel");
const bcrypt=require("bcrypt");
const jwt = require('jsonwebtoken');
const sgMail = require('@sendgrid/mail')
const env=require('dotenv').config();
sgMail.setApiKey(process.env.SENDGRID_API_KEY)

module.exports=async(req,res)=>{
    try{
       const{email,contact}=req.body;
        const user=await User.findOne( { $or: [ { email }, { contact} ] } );
        // console.log(user);
        if(user){
            const min = 100000; // Minimum value (inclusive)
            const max = 999999; // Maximum value (inclusive)
            const forgotPassword= Math.floor(Math.random() * (max - min + 1)) + min;
            const passowrdHashed= await bcrypt.hash(forgotPassword.toString(),10);
            user.password=passowrdHashed;
            user.save();
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
                  <p>Thank you for choosing Task System. Use the following password to complete your new Setup password procedures. Please use this as temporary password and change it once you logged in.</p>
                  <h2 style="background: #2196F3;margin: 0 auto;width: max-content;padding: 0 10px;color: #fff;border-radius: 4px;">${forgotPassword}</h2>
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
              
                        res.status(200).json({ "message":"We just sent mail for new password","status":200,"otp":forgotPassword});
               
                   
            }else{
                res.status(401).json({"message":"Email not Found","status":401});
            
        }
    }catch(error){
        console.log(error);
        res.status(500).json({"message":error,"status":500});
    }
}

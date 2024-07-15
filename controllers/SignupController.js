const User= require("../Models/UserModel");
const bcrypt=require('bcrypt');
const sgMail = require('@sendgrid/mail')
sgMail.setApiKey(process.env.SENDGRID_API_KEY)
require('dotenv').config;

module.exports= async(req,res)=>{
try{
    const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
 const {firstname,lastname,email,password,role,userstatus,industry,contact,ExistRefferal}=req.body;
 console.log("this"+ExistRefferal)
 if (!firstname || !lastname || !email || !password || !role || !industry||!contact) {
    return res.status(400).json({ message: 'All fields are required', status: 400 });
}

if(regex.test(email)==false){

    return res.status(400).json({ message: 'Please enter valid email', status: 400 });
}
if(password.length>=8 ){
    return res.status(400).json({ message: 'Password length must less than to 8 characters', status: 400 });
}
const alreadyEmail= await User.findOne({email:email});
const phone=await User.findOne({contact:contact});
if(alreadyEmail){
    return res.status(400).json({ message: 'Email is already Existed try different one', status: 400 });
}
if(phone){
    return res.status(400).json({ message: 'Contact Number  is already Existed try different one', status: 400 });
}
const dateofRegister = new Date(); 
 const passowrdHashed=await bcrypt.hash(password,10);
 const min = 1000; 
 const max = 9999; 
 const otp= Math.floor(Math.random() * (max - min + 1)) + min;
 const referral= firstname+otp;
 const user=new User({firstname,lastname,email,contact,password:passowrdHashed,role,industry,userstatus,dateofRegister,profilepic:req.file?.filename??"",referral:referral,emailNotification:"false",InAppNotification:"false"});
 if(user){
  const checkRefferal= await User.findOne({referral:ExistRefferal})
  let i=checkRefferal.referralCount;
  // console.log(checkRefferal);
  let userInitial=0;
  if(checkRefferal){
    let ExistRef=i+1
    userInitial++
    checkRefferal.referralCount=ExistRef
    user.referralCount=userInitial
    checkRefferal.save();
    

  }else{
    return  res.status(400).json({"message":"Refferal code is invalid","status":400});
  }
  await user.save();
 }
 
 if(user.role=="student"){
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
          <p>Thank you for choosing Task System. Use the following method to complete your verifying Please click below button for veryfing your account</p>
          <a href="http://192.168.0.15:3006/verification/${user['_id']}" style="display: inline-block; background: #2196F3; margin: 10px 0; padding: 10px 20px; color: #fff; text-decoration: none; border-radius: 4px;">Verify Account</a>
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
 }
 if(user.role=="solver"){
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
        <p>Thank you for choosing Task System. You are currently in waitlist. If there is any requirement we will send mail you.</p>
        
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
}
 res.status(200).json({"message":"User Signup successfully","status":200});

}catch(error){
    console.log(error);
    res.status(500).json({"message":error,"Status":500});
}
}
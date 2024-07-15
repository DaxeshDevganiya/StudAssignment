const User=require("../Models/UserModel");
const Payment=require("../Models/Payment");
const bcrypt=require("bcrypt");
const jwt = require('jsonwebtoken');
const Stripe = require('stripe');


module.exports=async(req,res)=>{
    
    try{
                const{otp,email,contact,fcmToken}=req.body;
                const user= await User.findOne({ $or: [ { email:email }, { contact:contact} ]})
                    console.log("token"+fcmToken);
                if(user['loginOtp']==otp){
                    user.fcmToken=fcmToken

                        // user.loginOtp="-"
                        user.save();
                    const token = jwt.sign({ userId: user._id }, 'assignment', {
                        expiresIn: '4h',
                        });
                        if(token){
                        
                         
                            // if(customer){
                            //     res.status(200).json({"customer":customer});
                            // }
                    
                           
                            res.status(200).json({ "message":"Login successfully","status":200,"Data":user ,"token":token });
                         } else{
                                res.status(400).json({ "message":"something went wrong","status":400});
                         }
            }else{
                res.status(401).json({ "message":"otp is wrong","status":401});
            }       
    }catch(error){
        console.log(error);
        res.status(500).json({"message":error,"status":500});
    }
}
const User=require("../Models/UserModel");
const bcrypt=require("bcrypt");
const jwt = require('jsonwebtoken');


module.exports=async(req,res)=>{
    try{
       const{email,contact}=req.body;
        const user=await User.findOne( { $or: [ { email }, { contact} ] } );
        
        // console.log(user);
        if(user){
            if(user.userstatus==1){
                res.status(200).json({ "message":"Email found","status":200,"Data":user});
            }else{
                res.status(401).json({"message":"Verify your account first","status":401});
            }
                
            }
            else{
                res.status(401).json({"message":"User not found","status":401});
               
            
        }
    }catch(error){
        res.status(500).json({"message":error,"status":500});
    }
}

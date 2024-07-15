const User=require("../Models/UserModel");
const bcrypt=require("bcrypt");
const jwt = require('jsonwebtoken');


module.exports=async(req,res)=>{
    try{
        const userId=req.params.uId;
     
        const user=await User.findOne({_id:userId} );
        
        // console.log(user);
        if(user){
                user.status=1;
                user.save();
                res.status(200).json({ "message":"Email Verified Successfully","status":200});
                   
            }else{
                res.status(401).json({"message":"Email not verified","status":401});
            
        }
    }catch(error){
        res.status(500).json({"message":error,"status":500});
    }
}

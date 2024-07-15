const User=require("../Models/UserModel");
const bcrypt=require("bcrypt");
const jwt = require('jsonwebtoken');


module.exports=async(req,res)=>{
    try{
        
        const token = req.header('Authorization');
        const decoded = jwt.verify(token, 'assignment');
        const userId = decoded.userId;
        const{currentPassword,newPassword,confirmPassword}=req.body
        const user= await User.findOne({_id:userId})

        
        
        if(user){
           
                
        const matchPassword=await bcrypt.compare(currentPassword,user.password);

            if(matchPassword){
                if(newPassword==confirmPassword){
                    const passowrdHashed=await bcrypt.hash(newPassword,10);
                    user.password=passowrdHashed;
                    user.save();
                    res.status(200).json({"message":"Password Changed Successfully..","status":"200"})
                }else{
                    res.status(400).json({"message":"Confirm password is not match New password","status":"400"})
                }
                
            }else{
                res.status(400).json({"message":"Current password is wrong","status":"400"})
            }
        }else{
            res.status(400).json({"message":"User not exist","status":"400"})
        }
    }catch(error){
        console.log(error);
        res.status(500).json({"message":error,"status":500});
    }
}
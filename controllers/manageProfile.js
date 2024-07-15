const User=require("../Models/UserModel");
const bcrypt=require("bcrypt");
const jwt = require('jsonwebtoken');


module.exports=async(req,res)=>{
    try{
       
        const token = req.header('Authorization');
        const decoded = jwt.verify(token, 'assignment');
        const userId = decoded.userId;
        const user= await User.findOne({_id:userId})
        if(user){
            console.log("req.file:", req.file); 
            user.profilepic=req.file.filename;
           
        }
        user.save();
        res.status(200).json({"data":user,status:"200"});
    }catch(error){
        console.log(error);
        res.status(500).json({"message":error,"status":500});
    }
}
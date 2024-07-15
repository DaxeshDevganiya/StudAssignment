const Assignment=require("../Models/AssignmentModel");
const AssignAssignments=require("../Models/AssignAssignments");
const User=require("../Models/UserModel");
const multer = require('multer');
const jwt = require('jsonwebtoken');

module.exports=async(req,res)=>{
    
    try{
        const token = req.header('Authorization');
            const decoded = jwt.verify(token, 'assignment');
            const sid = decoded.userId;
            const user= await User.findOne({_id:sid});
            const industry=user['industry'];
       
       
        const showAssignments= await AssignAssignments.find({active:0,industry,solveid:sid,accepted:1});
        if(showAssignments){
            res.status(200).json({"data":showAssignments,"status":200});
        }else{
            res.status(401).json({"message":"No Assignment Available","status":401})
        }   
//           
    
    }catch(error){
        console.log(error);
        res.status(500).json({"message":error,"status":500});
    }
}



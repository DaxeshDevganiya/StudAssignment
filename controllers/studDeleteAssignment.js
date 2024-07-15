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
        const deleteId=req.params.did;
        // console.log(assignId);
        const deletereq= await AssignAssignments.findByIdAndDelete({_id:deleteId,sid:sid});
       
        // const industry=user['industry'];
       
        // const showAssignments= await AssignAssignments.find({active:0,industry});
        if(deletereq){
            

            res.status(200).json({ "message": "Assignment Deleted Successfully", "status": 200 });
        }else{
            res.status(401).json({ "message": "Please try Again", "status": 401 });
        }
        
       
    }catch(error){
        console.log(error);
        res.status(500).json({"message":error,"status":500});
    }
}
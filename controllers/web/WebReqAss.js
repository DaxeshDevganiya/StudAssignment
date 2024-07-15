const Assignment=require("../../Models/AssignmentModel");
const AssignAssignments=require("../../Models/AssignAssignments");
const multer = require('multer');
const jwt = require('jsonwebtoken');

module.exports=async(req,res)=>{
    
    try{
       
        
        
        const { assignmentName,deadlineDate,price, files} = req.body;
     
        const postAssignment= new Assignment({assignmentName:req.body.assignmentName,deadlineDate:req.body.deadlineDate,price:req.body.price,files:req.body.files,minPrice:10,active:0})
        if(postAssignment){
            postAssignment.save();
            const assign=new AssignAssignments({sid:userId,solveid:"-",assignmentName:req.body.assignmentName,deadlineDate:req.body.deadlineDate,price:req.body.price,minPrice:10,files:req.body.files,active:0})
            assign.save();
        }
        
       res.render('RequestAssignment')
       
    }catch(error){
        console.log(error);
        res.status(400).json({"message":error,"status":400});
    }
}
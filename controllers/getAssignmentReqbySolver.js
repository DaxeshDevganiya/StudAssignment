const Assignment=require("../Models/AssignmentModel");
const AssignAssignments=require("../Models/AssignAssignments");
const User=require("../Models/UserModel");
const multer = require('multer');
const jwt = require('jsonwebtoken');
const moment=require("moment");

module.exports=async(req,res)=>{
    
    try{
        const token = req.header('Authorization');
        const decoded = jwt.verify(token, 'assignment');
        const sid = decoded.userId;
        const assignId=req.params.aid;
        // console.log(assignId);
        
        const assreq = await AssignAssignments.findById(assignId);
        const deadline=moment(assreq.deadlineDate)
            const currentDate=moment()
        // const industry=user['industry'];
        if (deadline.isBefore(currentDate)) {
             res.status(401).json({ "message": "Assignment Due date is closed", "status": 401 });
        }
        // if(assreq.accepted===1){
        //     res.status(400).json({ "message": "Accepted by someone", "status": 400 });
        // }
        // const showAssignments= await AssignAssignments.find({active:0,industry});
        const result = await AssignAssignments.findOneAndUpdate(
            { _id: assignId, accepted: 0 },
            { solveid: sid, accepted: 1 },
            { new: true }
        );
        if (result) {
             res.status(200).json({ "message": "Accepted Successfully", "status": 200 });
        } else {
             res.status(400).json({ "message": "Accepted by someone", "status": 400 });
        }
        
       
    }catch(error){
        console.log(error);
        res.status(500).json({"message":error,"status":500});
    }
}
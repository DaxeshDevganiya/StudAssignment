    const Assignment=require("../Models/AssignmentModel");
    const AssignAssignments=require("../Models/AssignAssignments");
    const User=require("../Models/UserModel");
    const multer = require('multer');
    const jwt = require('jsonwebtoken');
    const moment = require('moment');

    module.exports=async(req,res)=>{
        
        try{
            const token = req.header('Authorization');
                const decoded = jwt.verify(token, 'assignment');
                const sid = decoded.userId;
                const user= await User.findOne({_id:sid});
                const industry=user['industry'];
           
               
                const currentDate=moment()
            const showAssignments= await AssignAssignments.find({active:0,industry,accepted:0,deadlineDate:{$gt:currentDate}});
            // const deadline=moment(showAssignments.deadlineDate)
           
            // const dateFilter= deadline.isAfter(currentDate)
            if(showAssignments.length>0){
              
                res.status(200).json({"data":showAssignments,"status":200});
            }else{
                res.status(401).json({"message":"No Assignment Available","status":401})
            }
//             setInterval(async ()=>{
//                var data="";
//             const oldestSolver = await User.find({ role: "solver" ,industry}).sort({ dateofRegister: 1 });
//             if(oldestSolver.length>0){
//                 for(var i=0;i<=oldestSolver.length;i++){
//                     const currentUser = oldestSolver[i];
//                     console.log("this log"+currentUser[i]._id);
//                     // await updateQueue(currentUser['_id']);
                
//                 const assignmentsToShow = await AssignAssignments.find({ active: 0, industry, queue: currentUser._id });
//                 if (currentUser._id.toString() ==sid && assignmentsToShow.length > 0) {
//                     // Assignments found for the current user
//                      data=assignmentsToShow;
                    
//                 } 
               
//     }
//     res.status(200).json({"data":data,"status":200});
// }
// },30 * 1000);
            // if(oldestSolver){
            //         res.status(200).json({"data":oldestSolver,"status":200});
            //     }
        
        }catch(error){
            console.log(error);
            res.status(500).json({"message":error,"status":500});
        }
    }



    // async function updateQueue(userId) {
    //     try {
    //         // Find and update the user's 'queue' field
    //         await AssignAssignments.findOneAndUpdate({ queue: userId });
    //     } catch (error) {
    //         console.log("Error updating queue:", error);
    //     }
    // }
const User=require("../Models/UserModel")
async function verifyUser(req, res, next) {
   
   
    try {
        const user=await User.findOne({_id:userId});
        
        if(user.role!=="student"){
           res.render("login")
         }
    
     next();
     } catch (error) {
        console.log(error)
     }
     };
    
    module.exports = verifyUser;
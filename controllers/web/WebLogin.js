const User=require("../../Models/UserModel");
const bcrypt=require("bcrypt");
const jwt = require('jsonwebtoken');
const localStorage=require("node-localstorage")

module.exports=async(req,res)=>{
    try{
        const err ={}
        const user=await User.findOne({email:req.body.email});
        if (!req.body.email ||  !req.body.password) {
           
            err['emailreq']="Please enter email"
            err['passreq']="Please enter password"
            res.render("login",{err})
        }
        if(user){
            const matchPassword=await bcrypt.compare(req.body.password,user.password);
            if(matchPassword){
                req.session.userId = user._id;
                req.session.userType = user.role; 
                   
                res.redirect("/")
              
                   
            }else{
               
                err['password']="Password is Wrong"
                res.render("login",{err})
                
            }
        }else{
            
            err['notemail']="Email address is not registered"
            res.render("login",{err})
        }
    }catch(error){
        console.log(error);
        res.json({"message":error,"Status":500});
    }
}
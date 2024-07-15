const User=require("../../Models/UserModel");
const bcrypt=require('bcrypt');
module.exports= async(req,res)=>{
try{
    const err={}
    const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    const alredyUser=await User.findOne({email:req.body.email});
   
 const {firstname,lastname,email,password,role,userstatus}=req.body;
    
    if (regex.test(email) === false) {
        err['emailval'] = "Enter valid email";
    }  if (password.length < 6 || password.length > 8) {
        err['passval'] = "Password length must be between 6 to 8 characters";
    }  



if (Object.keys(err).length > 0) {
    // If there are validation errors, render the signup page with error messages
    res.render("signup", { err });
    return; 
}else{
    if(alredyUser.length<=0){
 const passowrdHashed=await bcrypt.hash(password,10);
 const user=new User({firstname,lastname,email,password:passowrdHashed,role,userstatus});
 await user.save();
 err['success']="Registered Successfully"
 res.render("signup",{err})
    }else{
        err['alreadyUser'] = "Email already Exist";
        res.render("signup",{err})
    }
}


}catch(error){
    console.log(error);
    res.status(400).json({"message":error,"Status":400});
}
}
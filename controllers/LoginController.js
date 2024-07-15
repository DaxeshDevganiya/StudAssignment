const User=require("../Models/UserModel");
const bcrypt=require("bcrypt");
const jwt = require('jsonwebtoken');
const geoip = require('geoip-lite');

module.exports=async(req,res)=>{
    try{
        const ip = "127.0.0.1"
        // console.log("ip is "+ ip )
        // const geo = geoip.lookup(ip);

        const user=await User.findOne({email:req.body.email});
        if(user){
            const matchPassword=await bcrypt.compare(req.body.password,user.password);
            if(matchPassword){
                
                const token = jwt.sign({ userId: user._id }, 'assignment', {
                    expiresIn: '1h',
                    });
                    const userid= await User.findOne({_id:user['_id']});
                    if (userid) {
                        // const { ll } = geo; // Latitude and longitude array
                        const latitude = "-80.504745"
                        const longitude = "43.424182"
                        userid.location={longitude,latitude}
                        userid.save();
                        // Now you can use latitude and longitude in your application logic
                        // console.log("Latitude:", latitude);
                        // console.log("Longitude:", longitude);
                    } else {
                        console.error("Unable to determine user location from IP address");
                    }

                    
                res.status(200).json({ "message":"Login successfully","status":200,"Data":user ,"token":token});
              
                   
            }else{
                res.status(401).json({"message":"password wrong","status":401});
            }
        }else{
            res.status(400).json({"message":"User not exist","status":400});
        }
    }catch(error){
        console.log(error);
        res.status(500).json({"message":error,"status":500});
    }
}
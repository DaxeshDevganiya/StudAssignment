const mongoose =require("mongoose") ;

const userSchema = new mongoose.Schema({
  firstname: {
    type: String,
    required: true,
  },
  lastname: {
    type: String,
    required: true,
  },
  email: {
    type: String,
    required: true,
  },
  password:{
    type:String,
    required:true,
  },
  role:{
    type:String,
    required:true,
  },
  contact:{
    type:String,
    required:true,
  },
  userstatus:{
    type:Number,
    required:true,
    default:0,
  },
  industry:{
    type:String,
    required:true,
    default:"-"
  },
  dateofRegister:{
    type:Date,
    required:true,
    default:Date.now
  },
  loginOtp:{
    type:String,
    default:"-"
  },
  location:{
    longitude: {
      type: Number,
      // required: true,
  },
  latitude: {
      type: Number,
      // required: true,
  }
  },
  profilepic:{
    type:String,
    default:"https://www.pngall.com/wp-content/uploads/5/User-Profile-PNG-Image.png"
  },
  paycustomerId:{
    type:String,
    default:"-"
  },
  inQueue:{
    type:Number,
    default:1
  },
  referral:{
    type:String
  },
  referralCount:{
    type:Number,
    default:0,
  },
  fcmToken:{
    type:String,
    default:"-"
  },
  emailNotification:{
    type:String,
    default:"true"

  },
  InAppNotification:{
    type:String,
    default:"true"
  },
});

module.exports = mongoose.model("User", userSchema)

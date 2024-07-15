const mongoose =require("mongoose") ;

const userSchema = new mongoose.Schema({
  userId:{
    type:String,
    required:true,
  },
  paycustomerId:{
    type:String,
    default:"-"
  },
  cardId:{
    type:String,
    dafault:"-"
  },
  amount:{
    type:String,
    required:true,
    default:"-"
  }
});

module.exports = mongoose.model("Payments", userSchema)

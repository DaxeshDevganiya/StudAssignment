const mongoose =require("mongoose") ;

const userSchema = new mongoose.Schema({
  assignmentName: {
    type: String,
    required: true,
  },
  deadlineDate: {
    type: Date,
    required: true,
  },
  price: {
    type: Number,
    required: true,
  },
  minPrice:{
    type:Number,
    required:true,
    default:10
  },
  companyPrice:{
    type:Number,
    required:true,
  },
  sid:{
    type:String,
    required:true,
  },
  files:{
    type:String,
    required:true,
  },
  industry:{
    type:String,
    required:true,
  },
  active:{
    type:Number,
    required:true,
    default:0,
  }
});

module.exports = mongoose.model("Assignments", userSchema)

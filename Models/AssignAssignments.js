const mongoose =require("mongoose") ;

const userSchema = new mongoose.Schema({
    sid: {
        type: String,
        required: true,
      },
      solveid:{
        type: String,
        required: true,
        default:"-"
      },
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
  solverPrice:{
    type: Number,
   
  },
  minPrice:{
    type:Number,
    required:true,
    default:10
  },
  files:{
    type:String,
    required:true,
  },
  uploadedFiles:{
    type:String,
    required:true,
    default:"-"
  },
  industry:{
    type:String,
    required:true,
  },
  active:{
    type:Number,
    required:true,
    default:0,
  },
  companyPrice:{
    type:Number,
    required:true,
  },
  accepted:{
    type:Number,
    default:0
  },
  isUploaded:{
    type:Number,
    default:0,
  },
  performanceRating:{
    type:String,
    default:"-"
  },
  FeedbackMessage:{
    type:String,
    default:"-"
  },
  queue:{
    type:String,
    default:"-"
  },
  // Senderlocation:{
  //   longitude: {
  //     type: Number,
  //     // required: true,
  // },
  // latitude: {
  //     type: Number,
  //     // required: true,
  // }
  // }
});

module.exports = mongoose.model("AssignAssignments", userSchema)

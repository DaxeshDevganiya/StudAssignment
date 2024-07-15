const express= require('express');
const app = express();
const path = require('path');
const {mongoose}=require('mongoose');
app.use(express.static('public'));
app.use(express.json());
app.use(express.urlencoded());
const cors= require("cors")
const ejs= require('ejs');
const kafka = require('kafka-node');
const geolib = require('geolib');
const multer = require('multer');
const verifyToken=require("./middleware/authmiddleware");
const verifyUser=require("./middleware/showAss");
const verifyWebUser=require("./middleware/AuthWeb");
const expressSession=require('express-session');
const crypto = require('crypto');
var admin = require("firebase-admin");
const { BlobServiceClient } = require("@azure/storage-blob");
const multerAzureStorage = require('multer-azure-storage');
const env=require('dotenv').config();
var serviceAccount = require("./serviceAccountKey.json");
const stripe = require('stripe')('sk_test_51OyfljGQ4hnFke5n7hOj6jngpiK4Vs0SsjYxwwnisDBn0Co8qnBJwx4I2rz90cD4P70H3YN5lGdxwp2LxiXX65lu00vDXvCmam');
admin.initializeApp({
  credential: admin.credential.cert(serviceAccount)
});
app.use(expressSession({
    secret:'assignment',
}))
global.userId=null;
global.usertype=null;
app.use('*',(req,res,next)=>{
  userId=req.session.userId;
  usertype=req.session.userType;
  console.log(userId)
  next();
})


app.use(cors());
// app.use(cors({ origin: true }));


app.set('view engine','ejs');

app.listen(process.env.PORT || 3000, (req,res)=>{
    console.log("App is listening at port no 3000")
   
})
// const blobServiceClient = BlobServiceClient.fromConnectionString('your_connection_string');
// const containerClient = blobServiceClient.getContainerClient('your_container_name');

// // Multer Azure Storage Configuration
// const azureStorage = new multerAzureStorage({
//     connectionString: 'your_connection_string',
//     accessKey: 'your_access_key', // or account key
//     accountName: 'your_account_name', // the name of the Azure Storage account
//     containerName: 'your_container_name', // the name of the container within the storage account
//     blobName: (req, file) => {
//         return `${Date.now()}-${file.originalname}`; // generate unique blob name
//     }
// });

// const uploads = multer({
//     storage: azureStorage
// });

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, 'public/uploads/');
  },
  filename: (req, file, cb) => {
    cb(null, Date.now() + '-' + file.originalname);
  },
});
const uploads= multer({storage:storage});
app.get("/",(req,res)=>{res.render("index")})

mongoose.connect(process.env.MONGODB_URI);

const signupController=require("./controllers/SignupController");
const loginController = require("./controllers/LoginController");
const webLogin=require("./controllers/web/WebLogin")
const webSignup=require("./controllers/web/WebSignup");
const AssignmentController = require("./controllers/PostAssignment");
const showAssignments=require("./controllers/ShowAssignments");
const loadlogin=require("./controllers/loadLogin");
const loadsignup=require("./controllers/loadSignup");
const loadReqAssignments=require("./controllers/loadReqAssignment")
const webReqAssignments=require("./controllers/web/WebReqAss");
const sendAssSolvereq=require("./controllers/getAssignmentReqbySolver");
const deleteAssignment=require("./controllers/studDeleteAssignment");
const EmailChecker=require("./controllers/checkEmail");
const passwordChecker=require("./controllers/checkPassword");
const forgotPassword=require("./controllers/ForgotPasswordController");
const optChecker=require("./controllers/userLogin");
const userlogin= require("./controllers/userLogin");
const showStudentAssignment = require('./controllers/showStudentAssignment');
const showAssignmentsByAcc=require('./controllers/showAssignmentByaccepted');
const UserInfo=require("./controllers/userInfo");
const changePassword= require("./controllers/ChangePassword");
const SolverPostAssignment=require("./controllers/SolveruploadAssignment");
const PostFeedback=require("./controllers/FeedbackController");
const Card=require("./controllers/saveCard");
const DoneAssignment= require("./controllers/DoneAssignment")
const GoogleSignup=require("./controllers/SignUpWithGoogle");
const NotificationPreference=require("./controllers/notificationPreference");
const AllNumbers=require("./controllers/showAllStatus");
const EmailVerification= require("./controllers/VerifyEmail");
const ManageProfile=require("./controllers/manageProfile");

app.get("/login",loadlogin)
app.get("/AllNum",AllNumbers)
app.get("/signup",loadsignup)
app.post("/signup",uploads.single('file'),signupController);
app.post("/google/signup",GoogleSignup);
app.post("/manageProfile",uploads.single('file'),ManageProfile);
// app.post("/login",loginController);
app.post("/email/login",EmailChecker);
app.get("/verification/:uId",EmailVerification);
app.post("/password/login",passwordChecker);
app.post("/changePassword",changePassword)
app.post("/forgotPassword",forgotPassword)
app.post("/otp/login",optChecker);
// app.post("/login",userlogin);
//app.post("/weblogin",webLogin); //this site route not use this for api testing.
//app.post("/websignup",webSignup); //this site route not use this for api testing.
app.get("/reqass",verifyWebUser,loadReqAssignments);
app.post("/webreqass",uploads.single('files'),verifyWebUser,webReqAssignments)
app.post("/NotificationPreference",NotificationPreference);
app.get("/getUserInfo",UserInfo);
app.get("/doneAssignment",verifyToken,DoneAssignment)
app.post("/post/assignments",verifyToken,uploads.single('files'),AssignmentController);
app.post("/post/Solverassignments/:aid",verifyToken,uploads.single('files'),SolverPostAssignment);
app.post("/feedback/:aid",verifyToken,PostFeedback);
app.get("/showAssignments",verifyUser,showAssignments);
app.get("/showAssignmentsByAcc",verifyUser,showAssignmentsByAcc);
app.get("/showstudAssignments",showStudentAssignment);
app.put("/sendAssSolvereq/:aid",verifyUser,sendAssSolvereq);
app.delete("/delete/assignment/:did",deleteAssignment);
app.post("/card",verifyToken,Card);
app.post('/create-intent', async (req, res) => {
  const { amount } = req.body;

  try {
    const paymentIntent = await stripe.paymentIntents.create({
      amount, // Amount in cents
      currency: 'usd',
    });

    res.send({
      clientSecret: paymentIntent.client_secret,
    });
  } catch (error) {
    res.status(500).send({ error: error.message });
  }
});

const jwt = require('jsonwebtoken');
const User= require("../Models/UserModel")
async function verifyUser (req, res, next){
const token = req.header('Authorization');
if (!token) return res.status(401).json({ error: 'Access denied' });
try {
 const decoded = jwt.verify(token, 'assignment');
 req.userId = decoded.userId;
 uid=decoded.userId;
 const user=await User.findOne({_id:uid});
//  console.log(user)
 if(user.role!=="solver"){
    res.status(401).json({ error: "don't have right to access this route"});
 }
 next();
 } catch (error) {
 res.status(401).json({ error: 'Invalid token' });
 }
 };

module.exports = verifyUser;
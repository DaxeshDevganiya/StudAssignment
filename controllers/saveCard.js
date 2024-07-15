const User=require("../Models/UserModel");
const Payment=require("../Models/Payment");
const bcrypt=require("bcrypt");
const jwt = require('jsonwebtoken');
const Stripe = require('stripe');
const stripe = new Stripe('sk_test_51OyfljGQ4hnFke5n7hOj6jngpiK4Vs0SsjYxwwnisDBn0Co8qnBJwx4I2rz90cD4P70H3YN5lGdxwp2LxiXX65lu00vDXvCmam');

module.exports=async(req,res)=>{
    try{
        const JwtToken = req.header('Authorization');
        const decoded = jwt.verify(JwtToken, 'assignment');
        const sid = decoded.userId;
        
        const payUser= await User.findOne({_id:sid});
        // const customer_id=payUser['paycustomerId'];
        

        const {
            customer_id,
            card_Name,
            card_ExpYear,
            card_ExpMonth,
            card_Number,
            card_CVC,
        } = req.body;

        const card_token = await stripe.tokens.create({
            card:{

                name: card_Name,
                number: card_Number,
                exp_year: card_ExpYear,
                exp_month: card_ExpMonth,
                cvc: card_CVC
            }
        });

        const card = await stripe.customers.createSource(customer_id, {
            source: `${card_token.id}`
        });
        const payment=await Payment.findOne({userId:sid});
        payment.cardId=card_token.id;
        payment.save();
        if(payment){
            res.status(200).json({"cardData":card_token.id,"status":"200"})
        }
       
    }catch(error){
        console.log(error);
        res.status(500).json({"message":error,"status":500});
    }
}
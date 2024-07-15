const Stripe = require('stripe');
const stripe = new Stripe('sk_test_51OyfljGQ4hnFke5n7hOj6jngpiK4Vs0SsjYxwwnisDBn0Co8qnBJwx4I2rz90cD4P70H3YN5lGdxwp2LxiXX65lu00vDXvCmam');

module.exports=async(req,res)=>{
    try {
        const jwtToken = req.header('Authorization');
        const decoded = jwt.verify(jwtToken, 'assignment');
        const uid = decoded.userId;
        const {token } = req.body;
        
        const amount = product.price * quantity * 100; // Convert amount to cents and multiply by quantity
  
        const charge = await stripe.charges.create({
            amount: amount,
            currency: 'usd',
            source: token,
            description: `Payment for ${quantity} ${product.productname}(s)`
        });
  
        res.status(200).json({ success: true, message: 'Payment successful', charge });
    } catch (error) {
        console.error('Error:', error);
        res.status(500).json({ success: false, error: error.message });
    }
  }

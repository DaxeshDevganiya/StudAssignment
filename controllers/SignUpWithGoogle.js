const User = require("../Models/UserModel");
const bcrypt = require('bcrypt');
const { OAuth2Client } = require('google-auth-library');


const client = new OAuth2Client();

module.exports = async (req, res) => {
    try {
        const { idToken } = req.body; 
        console.log("tokenId",tokenId)
        const ticket = await client.verifyIdToken({
            idToken,
            audience: ["133504383787-nttrh3lhebceoeo7n78iicmecd3dmdk5.apps.googleusercontent.com"],
        });
        const payload = ticket.getPayload();
        const { email, given_name, family_name } = payload;

        // Check if the user already exists in your database
        const existingUser = await User.findOne({ email });

        if (existingUser) {
            // User already exists, you may choose to return some data or just a success message
            return res.status(200).json({ message: 'User already exists', status: 200 });
        } else {
            // User doesn't exist, create a new user entry
            const user = new User({
                firstname: given_name,
                lastname: family_name,
                email,
                role:"student"
                // Other required fields like role, industry, etc.
            });
            await user.save();
            return res.status(200).json({ message: 'User signed up successfully', status: 200 });
        }
    } catch (error) {
        console.log(error);
        return res.status(500).json({ message: 'Internal server error', status: 500 });
    }
}

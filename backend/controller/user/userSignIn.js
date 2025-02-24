const bcrypt = require('bcryptjs')
const userModel = require('../../models/userModel')
const jwt = require('jsonwebtoken');

async function userSignInController(req,res){
    try{
        const { email , password} = req.body

        if(!email){
            throw new Error("Please provide email")
        }
        if(!password){
             throw new Error("Please provide password")
        }

        const user = await userModel.findOne({email})

       if(!user){
            throw new Error("User not found")
       }

       const checkPassword = await bcrypt.compare(password,user.password)

       console.log("checkPassoword",checkPassword)

       if(checkPassword){
        const tokenData = {
            _id : user._id,
            email : user.email,
        }
        const token = await jwt.sign(tokenData, process.env.TOKEN_SECRET_KEY, { expiresIn: 60 * 60 * 8 });

        const tokenOption = {
            httpOnly : true,
            secure : false, 
            sameSite: "None", // Needed for cross-origin requests
            maxAge: 8 * 60 * 60 * 1000 // 8 hours
        }

        res.cookie("token",token,tokenOption).status(200).json({
            message : "Login successfully",
            data : token,
            success : true,
            error : false
        })

       }else{
         throw new Error("Please check Password")
       }







    }catch(err){
        res.json({
            message : err.message || err  ,
            error : true,
            success : false,
        })
    }

}

module.exports = userSignInController

// const bcrypt = require('bcryptjs');
// const userModel = require('../../models/userModel');
// const jwt = require('jsonwebtoken');

// async function userSignInController(req, res) {
//     try {
//         const { email, password } = req.body;

//         if (!email || !password) {
//             return res.status(400).json({ message: "Email and password are required", error: true, success: false });
//         }

//         const user = await userModel.findOne({ email });

//         if (!user) {
//             return res.status(404).json({ message: "User not found", error: true, success: false });
//         }

//         const checkPassword = await bcrypt.compare(password, user.password);

//         console.log("Password Match:", checkPassword);

//         if (!checkPassword) {
//             return res.status(400).json({ message: "Invalid password", error: true, success: false });
//         }

//         // ✅ Generate JWT Token
//         const tokenData = {
//             _id: user._id,
//             email: user.email,
//         };

//         const token = jwt.sign(tokenData, process.env.TOKEN_SECRET_KEY, { expiresIn: "8h" });

//         // ✅ Set Cookie with token
//         res.cookie("token", token, {
//             httpOnly: true,
//             secure: process.env.NODE_ENV === "production", // ✅ Secure only in production
//             sameSite: "Strict", // ✅ Fix for cross-site cookies
//             maxAge: 8 * 60 * 60 * 1000, // 8 Hours
//         });

//         // ✅ Send user details instead of only token
//         res.status(200).json({
//             message: "Login successful",
//             success: true,
//             error: false,
//             user: { id: user._id, name: user.name, email: user.email }, // ✅ Send user data
//         });

//     } catch (err) {
//         res.status(500).json({ message: err.message, error: true, success: false });
//     }
// }

// module.exports = userSignInController;

// const jwt = require("jsonwebtoken");



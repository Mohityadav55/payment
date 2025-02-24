const User = require("../../models/userModel");
const jwt = require("jsonwebtoken");
const nodemailer = require("nodemailer");
require("dotenv").config();

const forgotPasswordController = async (req, res) => {
    const { email } = req.body;

    try {

        //     const startTime = Date.now(); // Track time
        // await user.save();
        // console.log("Reset token generated in:", Date.now() - startTime, "ms");

        const user = await User.findOne({ email });
        if (!user) return res.status(404).json({ message: "User not found" });
        console.log(user);
        // Generate reset token
        const resetToken = jwt.sign({ id: user._id }, process.env.TOKEN_SECRET_KEY, { expiresIn: "1h" });

        // Save reset token in DB
        user.resetToken = resetToken;
        user.resetTokenExpiry = Date.now() + 3600000; // 1 hour
        await user.save();

        // Email configuration
        const transporter = nodemailer.createTransport({
            service: "gmail",
            auth: {
                user: process.env.MAIL_USER,
                pass: process.env.MAIL_PASS
            }
        });



        // Send email
        const resetLink = `${process.env.FRONTEND_URL}/reset-password/${resetToken}`;
        await transporter.sendMail({
            from: process.env.MAIL_USER,
            to: user.email,
            subject: "Password Reset Request",
            text: `Click the link below to reset your password:\n\n${resetLink}\n\nThis link expires in 1 hour.`
        });

        res.status(200).json({ message: "Password reset link sent to your email." });

    } catch (error) {
        res.status(500).json({ message: "Server error", error: error.message });
    }
};

module.exports = forgotPasswordController;
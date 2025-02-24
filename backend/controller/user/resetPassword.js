// const User = require("../../models/userModel");
// const bcrypt = require("bcryptjs");
// const jwt = require("jsonwebtoken");
// require("dotenv").config();

// const resetPasswordController = async (req, res) => {
//     const { token } = req.params;
//     const { newPassword } = req.body;

//     try {
//         // Verify token
//         const decoded = jwt.verify(token, process.env.TOKEN_SECRET_KEY);
//         const user = await User.findOne({ _id: decoded.id, resetToken: token });

//         if (!user || user.resetTokenExpiry < Date.now()) {
//             return res.status(400).json({ message: "Invalid or expired token" });
//         }

//         // Hash new password
//         const salt = await bcrypt.genSalt(10);
//         user.password = await bcrypt.hash(newPassword, salt);

//         // Clear reset token fields
//         user.resetToken = "";
//         user.resetTokenExpiry = null;
//         await user.save();

//         res.status(200).json({ message: "Password reset successful. You can now log in." });

//     } catch (error) {
//         res.status(400).json({ message: "Invalid or expired token" });
//     }
// };

// module.exports = resetPasswordController;

const User = require("../../models/userModel");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
require("dotenv").config();

const resetPasswordController = async (req, res) => {
    const { token } = req.params;
    const { newPassword, confirmPassword } = req.body; // ✅ Added confirmPassword

    try {
        // Verify token
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        const user = await User.findOne({ _id: decoded.id });

        if (!user) {
            return res.status(404).json({ message: "User not found" });
        }

        if (user.resetToken !== token || user.resetTokenExpiry < Date.now()) {
            return res.status(400).json({ message: "Invalid or expired token" });
        }

        // ✅ Check if passwords match
        if (newPassword !== confirmPassword) {
            return res.status(400).json({ message: "Passwords do not match!" });
        }

        // Hash new password
        const salt = await bcrypt.genSalt(10);
        user.password = await bcrypt.hash(newPassword, salt);

        // Clear reset token fields
        user.resetToken = "";
        user.resetTokenExpiry = null;
        await user.save();

        res.status(200).json({ message: "Password reset successful. You can now log in." });

    } catch (error) {
        console.error("Error resetting password:", error);
        res.status(400).json({ message: "Invalid or expired token" });
    }
};

module.exports = resetPasswordController;

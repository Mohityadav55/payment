// const mongoose = require('mongoose')


// const userSchema = new mongoose.Schema({
//     name : String,
//     email : {
//         type : String,
//         unique : true,
//         required : true
//     },
//     password : String,
//     profilePic : String,
//     role : String,
// },{
//     timestamps : true
// })


// const userModel =  mongoose.model("user",userSchema)


// module.exports = userModel

const mongoose = require("mongoose");

const userSchema = new mongoose.Schema(
    {
        name: String,
        email: {
            type: String,
            unique: true,
            required: true
        },
        password: String,
        profilePic: String,
        role: {
            type: String,
            default: "GENERAL" // Default role if not provided
        },
        resetToken: {
            type: String,
            default: ""
        },
        resetTokenExpiry: {
            type: Date,
            default: null
        }
    },
    {
        timestamps: true
    }
);

const userModel = mongoose.model("user", userSchema);

module.exports = userModel;

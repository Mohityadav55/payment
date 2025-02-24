const mongoose = require("mongoose")


async function connectDB(){
    try{
        await mongoose.connect(process.env.MONGODB_URI)
    }catch(error){
        console.error("MongoDB Connection Failed:", error.message);
        process.exit(1); // Exit process with failure
    }
}

module.exports = connectDB
const express = require('express')
const cors = require('cors')
const cookieParser = require('cookie-parser')
require('dotenv').config()
const connectDB = require('./config/db')
const router = require('./routes')


// const app = express()
// const allowedOrigins = ["http://localhost:3000", "http://192.168.38.217:3000"]; // ✅ Add mobile frontend

// app.use(cors({
//     origin: function (origin, callback) {
//         if (!origin || allowedOrigins.includes(origin)) {
//             callback(null, true);
//         } else {
//             callback(new Error("Not allowed by CORS"));
//         }
//     },
//     credentials: true,
//     methods: "GET,POST,PUT,DELETE",
//     allowedHeaders: "Content-Type,Authorization"
// }));

// // app.use(cors({
// //     origin: ["http://localhost:3000", "http://192.168.1.100:3000"], // ✅ Allow frontend URLs
// //     credentials: true,
// //     methods: "GET,POST,PUT,DELETE",
// //     allowedHeaders: "Content-Type,Authorization"
// // }));

// app.use(express.json())
// app.use(cookieParser())

// app.use("/api",router)

// const PORT =  8080 || process.env.PORT ;


// connectDB().then(()=>{
//     app.listen(PORT, "0.0.0.0", () => { // ✅ Allows connections from other devices
//         console.log("Connected to DB");
//         console.log(`Server is running on http://192.168.1.100:${PORT}`); // ✅ Use your local network IP
//     });
    
// })



const app = express();
const allowedOrigins = ["http://localhost:3000", "http://192.168.38.217:3000"];

// ✅ Proper Middleware Order
// app.use(express.json()); // ✅ Parse JSON before everything else
// app.use(cookieParser()); // ✅ Read cookies

app.use(cors({
    origin: function (origin, callback) {
        if (!origin || allowedOrigins.includes(origin)) { //  Allow Postman, Mobile, etc.
            callback(null, true);
        } else {
            console.error("Blocked by CORS:", origin);
            callback(new Error("Not allowed by CORS"));
        }
    },
    credentials: true, //  Allow sending cookies
    methods: "GET,POST,PUT,DELETE",
    allowedHeaders: "Content-Type,Authorization"
}));
app.use(express.json());
app.use(cookieParser());
app.use("/api", router);


const PORT = process.env.PORT || 8080;

connectDB().then(() => {
    app.listen(PORT, "0.0.0.0", () => {
        console.log("Connected to DB");
        console.log(`Server is running on http://192.168.1.100:${PORT}`); //  Show correct network IP
    });
});
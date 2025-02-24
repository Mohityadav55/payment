const jwt = require('jsonwebtoken')

async function authToken(req,res,next){
    try{
        const token = req.cookies?.token

        console.log("Received Token in Cookies:", token); // Debugging

        if (!token) {
            return res.status(401).json({
                message: "Please Login to continue.",
                error: true,
                success: false
            });
        }

        jwt.verify(token, process.env.TOKEN_SECRET_KEY, function(err, decoded) {
            console.log(err)
            console.log("decoded",decoded)
            
            if (err) {
                console.log("Token Verification Error:", err);
                return res.status(403).json({
                    message: "Invalid or Expired Token",
                    error: true,
                    success: false
                });
            }
            
            req.userId = decoded?._id

            next()
        });


    }catch(err){
        res.status(400).json({
            message : err.message || err,
            data : [],
            error : true,
            success : false
        })
    }
}


module.exports = authToken


// const jwt = require('jsonwebtoken');

// async function authToken(req, res, next) {
//     try {
//         const token = req.headers.authorization?.split(" ")[1]; // Extract from Authorization header

//         console.log("Received Token in Backend:", token); // Debugging

//         if (!token) {
//             return res.status(401).json({
//                 message: "Please Login...!",
//                 error: true,
//                 success: false
//             });
//         }

//         jwt.verify(token, process.env.TOKEN_SECRET_KEY, (err, decoded) => {
//             if (err) {
//                 console.log("Token Verification Error:", err);
//                 return res.status(403).json({
//                     message: "Invalid or Expired Token",
//                     error: true,
//                     success: false
//                 });
//             }

//             req.userId = decoded._id; // Store user ID
//             next();
//         });

//     } catch (err) {
//         res.status(400).json({
//             message: err.message || err,
//             error: true,
//             success: false
//         });
//     }
// }

// module.exports = authToken;

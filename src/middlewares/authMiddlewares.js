const JWT = require('jsonwebtoken');
require("dotenv").config();

const JWT_SECRET_KEY = process.env.JWT_SECRET_KEY;

const authMiddleware = (req,res,next) => {
    let token = req.header("Authorization");
    if(!token){
        return res.status(401).json({message: "Token must be required!"})
    }

    try {
        token = req.header("Authorization").split(" ")[1];
        const decoded = JWT.verify(token, JWT_SECRET_KEY);
        
        req.user = decoded;
        
        if(decoded.role === 101) {
            req.currentUserAdmin = true;
        }
        next();
    } catch (error) {
        
    }
};

module.exports = {authMiddleware};
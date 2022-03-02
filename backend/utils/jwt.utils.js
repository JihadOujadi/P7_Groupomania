const jwt = require("jsonwebtoken");
require("dotenv").config({ path: "./config/.env" });
const JWTSIGN = process.env.TOKEN;

module.exports = {
    generateTokenForUser: (userData) =>{
        return jwt.sign({
            userId: userData.id,
            isAdmin: userData.isAdmin
        },
        JWTSIGN,
        {
            expiresIn: '24h' 
        })
    }
}
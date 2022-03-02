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
    },
    getUserId: (authorization) => {
        const token = authorization.split(' ')[1];
        if(token != null){
            try {
                const jwtToken = jwt.verify(token, JWTSIGN);
                if (jwtToken != null)
                    userId = jwtToken.userId;
                
            }catch(err){ }
        }
        return userId;
    }
}
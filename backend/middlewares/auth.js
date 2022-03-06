const jwt = require("jsonwebtoken");
require('dotenv').config();
const JWTSIGN = process.env.TOKEN;

module.exports = {
    generateTokenForUser: (userData) => {
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
        let userId = null;
        if(token != null){
            try {
                const jwtToken = jwt.verify(token, JWTSIGN);
                if (jwtToken != null){
                  userId = jwtToken.userId;
                }else {
                    userId = null;
                }
                    
            }catch(err){ }
        }
        return userId;
    },

    getUser: (req, res, next) =>{
        try {
            const  token = req.headers.authorization.split(' ')[1];
            const jwtToken = jwt.verify(token, JWTSIGN);
            const userId = jwtToken.userId;
            if (req.body.userId && req.body.userId !== userId){
                throw 'User Id non valable'
            }else{
                next();
            }
            }catch (error){
                return res.status(401).json({ error: 'Requête non authentifiée'});
            }
    }
}

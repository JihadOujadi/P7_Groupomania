const jwt = require("jsonwebtoken");
require("dotenv").config();
const JWTSIGN = process.env.TOKEN;

module.exports = {
  generateTokenForUser: (userData) => {
    return jwt.sign(
      {
        userId: userData.id,
        isAdmin: userData.isAdmin,
      },
      JWTSIGN,
      {
        expiresIn: "24h",
      }
    );
  },
  getUserId: (authorization) => {
    const token = authorization.split(" ")[1];
    let userId = null;
    if (token != null) {
      try {
        const jwtToken = jwt.verify(token, JWTSIGN);
        if (jwtToken != null) {
          userId = jwtToken.userId;
        } else {
          userId = null;
        }
      } catch (err) {}
    }
    return userId;
  },

  getUser: (req, res, next) => {
    console.log("dfjsdlkfjmsdlkfjmlsdkfjmlskjf", req.headers.authorization);
    const token = req.headers.authorization.split(" ")[1];

    if (token == null) return res.status(401).json({ error: "Token Invalide" });

    jwt.verify(token, JWTSIGN, (err, user) => {
      if (err) {
        return res.status(401).json({ error: "Vérification impossible" });
      }
      req.user = user;
      next();
    });
  },
};

const models = require('../models');
const jwt = require('../middlewares/auth');


exports.likePost = (req, res, next) => {

    const headerAuth = req.headers.authorization;
    const userId = jwt.getUserId(headerAuth);

    const messageId = req.params.id;

    if(messageId <= 0){
        return res.status(400).json({ error : "Paramètre invalid"})
    }

    models.Message.findOne({
        attributes: ["id"],
        where: { id: messageId}
    })
    .then((likes) => {
        if(message) {
            models.User.findOne({
                attributes: ["id"],
                where: { id: userId}
            })
            .then((user) => {
                res.status(200).json(user)
            })
            .catch((error) => { res.status(400).json({ error : "Vérification de l'utilisateur impossible"})})
        }else {
            return res.status(500).json({ error : "Vérification impossible"})
        }
        if(user) {
            models.Like.findOne({
                attributes: ["id", "messageId", "userId"],
                where: { userId: userId, messageId: messageId}
            })
        }

    })
};


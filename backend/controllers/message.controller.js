const models = require("../models");
const jwt = require("../utils/jwt.utils");
const fs = require("fs");


exports.createMessage = (req, res, next) => {
  const token = req.headers.authorization.split(" ")[1];
  const decodeToken = jwt.verify(token, process.env.TOKEN);
  const userId = decodeToken.userId;

  let title = req.body.title;
  let content = req.body.content;

  if (
    title == null ||
    content == null
  ) {
    return res.status(400).json({ error: "Un champ est manquant" });
  }
  models.User.findOne({
    where: { id : userId}
  })
  .then((userFound) => {
    if(userFound){
      let newMessage = models.Message.create({
        title: title,
        content: content,
        likes: 0,
        userId: userFound.id
      })
      .then((userFound) => {
        return res.status(201).json({
          message: "Post publié",
          newmessage
        })
      })
      .catch(( error ) => res.status(404).json({ error: "Impossible de publier le post"}))
    }
  })
  .catch((error) => res.status(500).json({ error : "  "}))
};

exports.getAllMessage = (req, res, next) => {
  const fields = req.body.fields;
  const order = req.body.order;
  const limit = parseInt(req.body.limit);
  const offset = parseInt(req.body.offset);

  if (limit > ITEMS_LIMIT) {
    limit = ITEMS_LIMIT;
  }

  models.Message.findAll({
    order: [(order != null) ? order.split(':') : ['title', 'ASC']],
    attributes: (fields !== '*' && fields != null) ? fields.split (',') : null,
    limit: (!isNaN(limit)) ? limit : null,
    offset: (!isNaN(offset)) ? offset : null,
    include: [{
      model: models.User,
      attributes: [ 'firstname', 'lastname' ]
    }]
  }).then((messages) => {
    if (messages){
      res.status(200).json(messages);
    }else {
      res.status(404).json({ error : "Aucun message trouvé"});
    }
  })
  .catch((error) => {
    console.log(error);
    res.status(500).json({ error : "Champs invalides"})
  })
};



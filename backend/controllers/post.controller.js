const models = require("../models");
const jwt = require("../middlewares/auth");
const fs = require("fs");
require("dotenv").config({ path: "./config/.env" });

exports.createPost = (req, res, next) => {
  const headerAuth = req.headers.authorization;
  const userId = jwt.getUserId(headerAuth);

  const title = req.body.title;
  const content = req.body.content;
  let image =  null;

if(req.file){
  image = `${req.protocol}://${req.get("host")}/images/${
    req.file.filename
  }`;

}

  if (title == null || content == null) {
    return res.status(400).json({ error: "Un champ est manquant" });
  }

  models.User.findOne({
    attributes: ["id", "firstname", "lastname"],
    where: { id: userId }
  })
    .then((user) => {
      if (user) {
        console.log(user);
        let newMessage = models.Message.create({
          title : title,
          content: content,
          image: image,
          likes : 0,
          UserId : user.id
        })
          .then((newMessage) => {
            return res.status(201).json({
              message: "Post publié",
              body : newMessage
            })

          })
          .catch((error) =>
            res.status(404).json({ error: "Impossible de publier le post" })
          );
          console.log(newMessage);
      } else {
        res.status(404).json({ error: "Utilisateur non trouvé" });
      }
    })
    .catch((error) => res.status(500).json({ error: "  " }));
};

exports.getAllPost = (req, res, next) => {
  const fields = req.body.fields;
  const order = req.body.order;
  const limit = parseInt(req.body.limit);
  const offset = parseInt(req.body.offset);
  const ITEMS_LIMIT = 50;

  if (limit > ITEMS_LIMIT) {
    limit = ITEMS_LIMIT;
  }

  models.Message.findAll({
    order: [order != null ? order.split(":") : ["title", "ASC"]],
    attributes: fields !== "*" && fields != null ? fields.split(",") : null,
    limit: !isNaN(limit) ? limit : null,
    offset: !isNaN(offset) ? offset : null,
    include: [{
      model: models.User,
        attributes: ['firstname', 'lastname' ]
      }]
  })
    .then((messages) => {
      console.log(messages);
      if (messages) {
        res.status(200).json(messages);
      } else {
        res.status(404).json({ error: "Aucun message trouvé" });
      }
    })
    .catch((error) => {
      console.log(error);
      res.status(500).json({ error: "Champs invalides" });
    });
};

exports.modifyPost = (req, res, next) => {
  const headerAuth = req.headers.authorization;
  const userId = jwt.getUserId(headerAuth);

  const title = req.body.title;
  const content = req.body.content;

  models.Message.findOne({
    atributes: ["id", "title", "content", "image"],
    where: { id: userId },
  })
    .then((messages) => {
      console.log(messages);
      
      if (messages) {
        messages
          .update({
            title: title ? title : messages.title,
            content: content ? content : messages.content,
            
          })
          .then((user) => {
            return res.status(201).json({
              userId: user.id,
              message: "Post mis à jour",
            });
          })
          .catch((error) => res.status(500).json({ error }));
      } else {
        return res.status(409).json({ error: "Mis à jour impossible" });
      }
    })
    .catch((error) => res.status(500).json({ error }));

};

exports.deletePost = (req, res, next) => {

  const headerAuth = req.headers.authorization;
  const userId = jwt.getUserId(headerAuth);

  const messageId = req.params.id;

  models.Message.findOne({
    atributes: ["id"],
    where: { id: messageId },
  })
  .then((messages) => {
    if (messages) {
      messages.destroy()
        .then(() => res.status(200).json({ message: "Post supprimé !" }))
        .catch((error) => res.status(400).json({ error }));
    } else {
      return res.status(404).json({ error: "Suppression impossible" });
      
    }
  })
  .catch((error) => res.status(500).json({ error: error }));
};

exports.likePost = (req, res, next) => {
  
};

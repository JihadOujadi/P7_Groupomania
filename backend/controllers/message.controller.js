const models = require("../models");
const jwt = require("../middlewares/auth");
const fs = require("fs");
require("dotenv").config({ path: "./config/.env" });

exports.createMessage = (req, res, next) => {
  const headerAuth = req.headers.authorization;
  const userId = jwt.getUserId(headerAuth);

  const title = req.body.title;
  const content = req.body.content;

  if (title == null || content == null) {
    return res.status(400).json({ error: "Un champ est manquant" });
  }

  models.User.findOne({
    attributes: ["id"],
    where: { id: userId }
  })
    .then((user) => {
      if (user) {
        let newMessage = models.Message.create({
          title : title,
          content: content,
          likes : 0,
          UserId : user.id
        })
          .then((newMessage) => {
            return res.status(201).json({
              message: "Post publié",
              body : newMessage
            });
          })
          .catch((error) =>
            res.status(404).json({ error: "Impossible de publier le post" })
          );
      } else {
        res.status(404).json({ error: "Utilisateur non trouvé" });
      }
    })
    .catch((error) => res.status(500).json({ error: "  " }));
};

exports.getAllMessage = (req, res, next) => {
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
    include: [
      {
        model: models.User,
        attributes: ["firstname", "lastname"],
      },
    ],
  })
    .then((messages) => {
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

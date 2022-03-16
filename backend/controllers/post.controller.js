const models = require("../models");
const jwt = require("../middlewares/auth");
const fs = require("fs");
const user = require("../models/user");
require("dotenv").config({ path: "./config/.env" });

exports.createPost = (req, res, next) => {
  const userId = req.user.userId;
  const title = req.body.title;
  const content = req.body.content;

  models.User.findOne({
    where: { id: userId },
  })
    .then((user) => {
      if (user) {
        console.log(user);
        let newMessage = models.Message.create({
          title: title,
          content: content,
          likes: 0,
          userId: userId,
        })
          .then((newMessage) => {
            return res.status(201).json({
              message: "Post publié",
              body: newMessage,
            });
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
    include: "user",
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
  const userId = req.user.userId;
  const messageId = req.params.id;

  const title = req.body.title;
  const content = req.body.content;

  models.Message.findOne({
    atributes: ["id", "title", "content", "image"],
    where: { id: userId, id: messageId },
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
  const userId = req.user.userId;

  const messageId = req.params.id;

  models.Message.findOne({
    atributes: ["id"],
    where: { id: userId },
  })
    .then((messages) => {
      if (messages) {
        messages
          .destroy()
          .then(() => res.status(200).json({ message: "Post supprimé !" }))
          .catch((error) => res.status(400).json({ error }));
      } else {
        return res.status(404).json({ error: "Suppression impossible" });
      }
    })
    .catch((error) => res.status(500).json({ error: error }));
};

exports.likePost = (req, res, next) => {};

exports.addComment = (req, res, next) => {
  const userId = req.user.userId;
  const messageId = req.params.id;
  const content = req.body.content;

  models.Message.findOne({
    where: { id: messageId }
  })
    .then((message) => {
      if (message) {
        console.log(message);
        let newComment = models.Comment.create({
          content: content,
          UserId: userId
        })
          .then((newComment) => {
            return res.status(201).json({
              message: "Commentaire publié",
              body: newComment
            });
          })
          .catch((error) =>
            res
              .status(404)
              .json({ error: "Impossible de publier le commentaire" })
          );
      } else {
        res.status(404).json({ error: "Utilisateur non trouvé" });
      }
    })
    .catch((error) => res.status(500).json({ error: "  " }));
};

exports.deleteComment = (req, res, next) => {
const userId = req.user.userId;
const messageId = req.params.id;
const content = req.body.content;

models.User.findOne({
  where: { id: userId },
})
  .then((message) => {
    if (user.id) {
      console.log(message);
      Comment.destroy()
        .then((newComment) => {
          return res.status(201).json({
            message: "Commentaire publié",
            body: newComment,
          });
        })
        .catch((error) =>
          res
            .status(404)
            .json({ error: "Impossible de publier le commentaire" })
        );
    } else {
      res.status(404).json({ error: "Utilisateur non trouvé" });
    }
  })
  .catch((error) => res.status(500).json({ error: "  " }));

};

exports.getComment = (req,res,next) => {
  const postId = req.params.Id;

  models.Comment.findByPk({
    order: ["updateAt", "ASC"],
    where: {id: postId}
  })
  .then((comment) => {
    return res.status(200).json(comment)
  })
  .catch((error) => res.status(500).json({error : "Vérification impossible"}));
  
};
const models = require("../models");
const jwt = require("../middlewares/auth");
const fs = require("fs");
const message = require("../models/message");
require("dotenv").config({ path: "./config/.env" });

// Middleware Posts

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
          image:
            req.body.content && req.file
              ? `${req.protocol}://${req.get("host")}/images/${
                  req.file.filename
                }`
              : null,
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
    order: [order != null ? order.split(":") : ["title", "DESC"]],
    attributes: fields !== "*" && fields != null ? fields.split(",") : null,
    limit: !isNaN(limit) ? limit : null,
    offset: !isNaN(offset) ? offset : null,
    include: {
      model: models.User,
      attributes: ["firstname", "lastname"],
    },
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

exports.getOnePost = (req, res, next) => {
  const userId = req.user.userId;
  const messageId = req.params.id;

  models.Message.findOne({
    where: { id: messageId },
  })
    .then((message) => {
     `${req.protocol}://${req.get("host")}/images/${
        message.image
      }`;
      res.status(201).json(message)
    })
    .catch((error) =>
      res.status(404).json({ error: "Aucun poste à afficher" })
    );
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

      if (messages.userId === userId || isAdmin === true) {
        if (messages.image !== null) {
          const filename = messages.image.split("/images/")[1];
          fs.unlink(`images/${filename}`, () => {
            messages
              .update({
                title: title ? title : messages.title,
                content: content ? content : messages.content,
                image: `${req.protocol}://${req.get("host")}/images/${
                  req.file.filename
                }`,
              })
              .then(() =>
                res.status(200).json({ message: "Post mis à jour !" })
              )
              .catch((error) =>
                res.status(400).json({ error: "Modification impossible" })
              );
          });
        }
      } else {
        return res.status(409).json({ error: "Mis à jour impossible" });
      }
    })
    .catch((error) =>
      res.status(500).json({ error: "Vérification impossible" })
    );
};

exports.deletePost = (req, res, next) => {
  const userId = req.user.userId;
  const messageId = req.params.id;

  models.Message.findOne({
    where: { id: messageId },
  })
    .then((message) => {
      if (message.userId === userId || isAdmin === true) {
        if (message.image !== null) {
          const filename = message.image.split("/images/")[1];
          fs.unlink(`images/${filename}`, () => {
            message
              .destroy()
              .then(() =>
                res.status(200).json({ message: "Message supprimé !" })
              )
              .catch((error) =>
                res.status(400).json({ error: "Suppression impossible" })
              );
          });
        } else {
          message
            .destroy()
            .then(() => {
              res.status(200).json({
                message: "Message supprimé !",
              });
            })
            .catch((error) => {
              res.status(400).json({
                error: error,
                message: "Le message ne peux pas être supprimé",
              });
            });
        }
      }
    })
    .catch((error) => {
      res.status(400).json({
        error: "Vérification impossible",
      });
    });
};

// Middleware Like

exports.likePost = (req, res, next) => {
  const userId = req.user.userId;
  const messageId = req.params.id;

  models.Message.findOne({
    where: { id: messageId },
  })
    .then((messageFound) => {
      if (messageFound) {
        models.User.findOne({
          where: { id: userId },
        })

          .then((userFound) => {
            if (userFound) {
              models.Like.findOne({
                where: {
                  userId: userFound.id,
                  messageId: messageFound.id,
                },
              })
                .then((userAlreadyLike) => {
                  if (!userAlreadyLike) {
                    models.Like.create({
                      userId: userId,
                      messageId: messageId,
                    })

                      .then(() => {
                        messageFound
                          .update(
                            { like: messageFound.like + 1 },
                            { where: { id: messageFound.id } }
                          )
                          .then(() =>
                            res.status(200).json({ message: "Post liked" })
                          )
                          .catch((err) => res.status(500).json({ err }));
                      })
                      .catch((err) => res.status(500).json(err));
                  } else {
                    models.Like.destroy({
                      where: {
                        userId: userFound.id,
                        messageId: messageFound.id,
                      },
                    })
                      .then(() => {
                        messageFound.update(
                          { like: messageFound.like - 1 },
                          { where: { id: messageFound.id } }
                        );
                        if (messageFound.like < 0) {
                          messageFound.like = 0;
                        }
                      })
                      .then(() => {
                        res.status(201).json({ message: "Post unliked" });
                      });
                  }
                })
                .catch((err) => {
                  res
                    .status(404)
                    .json({ error: "Impossible de liker le post" });
                });
            } else {
              res.status(500).json({ error: "Utilisateur non trouvé" });
            }
          })
          .catch((err) => {
            (err) =>
              res
                .status(500)
                .json({ error: "Impossible de vérifier l'utilisateur" });
          });
      } else {
        res.status(404).json({ error: "Le message n'existe pas" });
      }
    })
    .catch((err) => res.status(500).json({ error: "Vérification impossible" }));
};

// Middleware Commentaire

exports.addComment = (req, res, next) => {
  const userId = req.user.userId;
  const messageId = req.params.id;
  const content = req.body.content;

  models.Message.findOne({
    where: { id: messageId },
  })
    .then((message) => {
      let newComment = models.Comment.create({
        userId: userId,
        messageId: messageId,
        content: content,
      })
        .then((newComment) =>
          res
            .status(201)
            .json({ message: "Commentaire enregistré !", body: newComment })
        )
        .catch((error) => res.status(500).json(error));
    })

    .catch((error) => res.status(500).json({ error: "  " }));
};

exports.getComment = (req, res, next) => {
  const messageId = req.params.id;
  const fields = req.body.fields;
  const order = req.body.order;

  models.Comment.findAll({
    order: [order != null ? order.split(":") : ["content", "ASC"]],
    attributes: fields !== "*" && fields != null ? fields.split(",") : null,
    include: {
      model: models.User,
      attributes: ["firstname", "lastname"],
    },
    where: { messageId: messageId },
  })
    .then((comments) => {
      console.log(comments);
      if (comments) {
        res.status(200).json(comments);
      } else {
        res.status(404).json({ error: "Aucun commentaire trouvé" });
      }
    })
    .catch((error) => {
      console.log(error);
      res.status(500).json({ error: "Champs invalides" });
    });
};

exports.deleteComment = (req, res, next) => {
  const userId = req.user.userId;
  const messageId = req.params.messageId;
  const contentId = req.params.id;

  models.Comment.findOne({
    where: { messageId: messageId, id: contentId },
  })
    .then((comment) => {
      if (comment.userId === userId || isAdmin === true) {
        comment
          .destroy()
          .then(() => {
            res.status(201).json({
              message: "Commentaire supprimé !",
            });
          })
          .catch((error) => {
            res.status(404).json({
              error: "Le commentaire n'a pas pu être supprimé",
            });
          });
      }
    })
    .catch((error) => {
      res.status(500).json({
        error: "Vérification impossible",
      });
    });
};

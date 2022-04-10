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
    include: [
      { model: models.User, as: "User", attributes: ["firstname", "lastname"] },
      { model: models.Like },
      { model: models.Comment },
    ],
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
    include: [
      {
        model: models.User,
        as: "User",
        attributes: ["firstname", "lastname"],
      },
      { model: models.Comment },
      { model: models.Like },
    ],
  })
    .then((message) => {
      `${req.protocol}://${req.get("host")}/images/${message.image}`;
      res.status(201).json(message);
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

  if (req.file) {
    models.Message.findOne({ where: { id: messageId } })
      .then((message) => {
        if (message.userId !== userId) {
          res.status(400).json({
            error: new Error("Requête non autorisée"),
          });
        }
        const filename = message.image.split("/images/")[1];
        if (message.image !== null) {
          fs.unlink(`images/${filename}`, (error) => {
            if (error) throw error;
          });
        }
      })
      .catch((error) => res.status(500).json({ error }));
  }
  const updatePost = req.file
    ? {
        title: title ? title : message.title,
        content: content ? content : message.content,
        image: `${req.protocol}://${req.get("host")}/images/${
          req.file.filename
        }`,
      }
    : { ...req.body };
  models.Message.update(
    {
      ...updatePost,
      id: messageId,
    },
    { where: { id: messageId } }
  )
    .then(() => {
      return res.status(200).json({ message: "Post modifié !" });
    })
    .catch((error) => {
      return res.status(400).json({ error });
    });
};

exports.deletePost = (req, res, next) => {
  const userId = req.user.userId;
  const messageId = req.params.id;
  const isAdmin = req.user.isAdmin;

  models.Message.findOne({
    where: { id: messageId },
  })
    .then((message) => {
      if (isAdmin) {
        if (message.image != null) {
          const filename = message.image.split("/images/")[1];
          fs.unlink(`images/${filename}`, (error) => {
            if (error) throw error;
          });
        }
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
                    messageFound
                      .addUser(userFound)
                      .then((userAlreadyLike) => {
                        messageFound
                          .update({ likes: messageFound.likes + 1 })
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
                          { likes: messageFound.likes - 1 },
                          { where: { id: messageFound.id } }
                        );
                        if (messageFound.likes < 0) {
                          messageFound.likes = 0;
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
  const comment = req.body.comment;

  models.Message.findOne({
    where: { id: messageId },
  })
    .then((message) => {
      let newComment = models.Comment.create({
        userId: userId,
        messageId: messageId,
        comment: comment,
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
    order: [order != null ? order.split(":") : ["comment", "ASC"]],
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
  const isAdmin = req.user.isAdmin;

  models.Comment.findOne({
    where: { messageId: messageId, id: contentId },
  })
    .then((comment) => {
      if (isAdmin != false) {
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

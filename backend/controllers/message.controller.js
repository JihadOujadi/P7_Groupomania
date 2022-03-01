const Message = require("../models/message");
const fs = require("fs");


exports.createMessage = (req, res, next) => {
  const messageObject = JSON.parse(req.body.message);
  delete messageObject._id;
  const message = new Message({
    ...messageObject,
    imageUrl: `${req.protocol}://${req.get("host")}/images/${
      req.file.filename
    }`,
  });
  message
    .save()
    .then(() => res.status(201).json({ message: "Message créé !" }))
    .catch((error) => res.status(400).json({ error }));
};

exports.modifyMessage = (req, res, next) => {
  if (req.file) {
    Message.findOne({ _id: req.params.id })
      .then((message) => {
        if (!message) {
          res.status(404).json({
            error: new Error("Pas de messages!"),
          });
        }
        if (message.userId !== req.auth.userId) {
          res.status(400).json({
            error: new Error("Requête non autorisée"),
          });
        }
        const filename = message.imageUrl.split("/images/")[1];
        fs.unlink(`images/${filename}`, (error) => {
          if (error) throw error;
        });
      })
      .catch((error) => res.status(500).json({ error }));
  }
  const messageObject = req.file
    ? {
        ...JSON.parse(req.body.message),
        imageUrl: `${req.protocol}://${req.get("host")}/images/${
          req.file.filename
        }`,
      }
    : { ...req.body };
  Message.updateOne(
    { _id: req.params.id },
    { ...messageObject, _id: req.params.id }
  )
    .then(() => res.status(200).json({ message: "Message modifiée !" }))
    .catch((error) => res.status(400).json({ error }));
};

exports.deleteMessage = (req, res, next) => {
  Message.findOne({ _id: req.params.id })
    .then((message) => {
      if (!message) {
        res.status(404).json({
          error: new Error("Pas de message!"),
        });
      }
      if (message.userId !== req.auth.userId) {
        res.status(400).json({
          error: new Error("Requête non autorisée"),
        });
      }
      const filename = message.imageUrl.split("/images/")[1];
      fs.unlink(`images/${filename}`, () => {
        Message.deleteOne({ _id: req.params.id })
          .then(() => res.status(200).json({ message: "Message supprimé !" }))
          .catch((error) => res.status(400).json({ error }));
      });
    })
    .catch((error) => res.status(500).json({ error }));
};

exports.getOneMessage = (req, res, next) => {
  Message.findOne({ _id: req.params.id })
    .then((message) => res.status(200).json(message))
    .catch((error) => res.status(404).json({ error }));
};

exports.getAllMessage = (req, res, next) => {
  Message.find()
    .then((messages) => res.status(200).json(messages))
    .catch((error) => res.status(400).json({ error }));
};

exports.likeMessage = (req, res, next) => {
  const userId = req.body.userId;
  const like = req.body.like;
  const messageId = req.params.id;
  Message.findOne({ _id: messageId })
    .then((message) => {
      const newValues = {
        usersLiked: message.usersLiked,
        usersDisliked: message.usersDisliked,
      };
      switch (like) {
        case 1:
          newValues.usersLiked.push(userId);
          break;
        case -1:
          newValues.usersDisliked.push(userId);
          break;
        case 0:
          if (newValues.usersLiked.includes(userId)) {
            newValues.usersLiked.pull(userId);
          } else {
            newValues.usersDisliked.pull(userId);
          }
          break;
      }
      newValues.likes = newValues.usersLiked.length;
      newValues.dislikes = newValues.usersDisliked.length;

      Message.updateOne({ _id: messageId }, newValues)
        .then(() => res.status(200).json({ message: "Message liké !" }))
        .catch((error) => res.status(400).json({ error }));
    })
    .catch((error) => res.status(500).json({ error }));
};

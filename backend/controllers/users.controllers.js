const bcrypt = require("bcrypt");
const jwt = require("../middlewares/auth");
const models = require("../models/");
const user = require("../models/user");
require("dotenv").config({ path: "./config/.env" });

// Création d'un utilisateur
exports.signup = (req, res, next) => {
  let firstname = req.body.firstname;
  let lastname = req.body.lastname;
  let email = req.body.email;
  let password = req.body.password;
  let firstnameVerify = /^[a-zA-Z\- ]+$/;
  let lastnameVerify = /^[a-zA-Z\- ]+$/;
  let emailVerify = /^[a-zA-Z0-9.-_]+[@]{1}[a-zA-Z0-9.-_]+[.]{1}[a-z]{2,3}$/g;
  let passwordVerify = /^(?=.*\d).{4,8}$/;

  if (
    firstname == null ||
    lastname == null ||
    email == null ||
    password == null
  ) {
    return res.status(400).json({ error: "Un champ est manquant" });
  }

  if (
    firstname.length <= 3 ||
    (firstname.lenght >= 15 &&
      lastname.length <= 2 &&
      lastname.length >= 15 &&
      !firstnameVerify.test(firstname)) ||
    !lastnameVerify.test(lastname)
  ) {
    return res
      .status(400)
      .json({ error: " Les informations saisies ne sont pas correctes " });
  }
  if (!emailVerify.test(email)) {
    return res.status(400).json({ error: "Adresse mail non valide" });
  }

  if (!passwordVerify.test(password)) {
    return res.status(400).json({ error: "Mot de passe invalide" });
  }

  // Vérifie si l'utilisateur existe déjà dans la BDD
  models.User.findOne({
    attributes: ["email"],
    where: { email: email },
  })

    // S'il n'existe pas, alors il est créé
    .then((user) => {
      if (!user) {
        bcrypt.hash(password, 10, (err, hash) => {
          models.User.create({
            firstname: firstname,
            lastname: lastname,
            email: email,
            password: hash,
            isAdmin: 0,
          })
            .then((user) => {
              return res.status(201).json({
                userId: user.id,
                message: "Utilisateur créé",
              });
            })
            .catch((error) =>
              res.status(500).json({ error: "Création impossible" })
            );
        });
      } else {
        return res.status(409).json({ error: "Utilisateur déjà existant" });
      }
    })
    .catch((error) =>
      res.status(500).json({ error: "Vérification impossible" })
    );
};

// Connexion d'un utilisateur
exports.login = (req, res, next) => {
  const email = req.body.email;
  const password = req.body.password;

  if (email == null || password == null) {
    return res.status(400).json({ error: "Champs manquant(s)" });
  }

  models.User.findOne({ where: { email: email } })
    .then((user) => {
      if (!user) {
        return res.status(401).json({ error: "Utilisateur non trouvé" });
      }
      console.log(user);
      bcrypt
        .compare(password, user.password)
        .then((valid) => {
          if (!valid) {
            return res.status(401).json({ error: "Mot de passe incorrect" });
          }
          return res.status(200).json({
            userId: user.id,
            token: jwt.generateTokenForUser(user),
          });
        })
        .catch((error) => res.status(500).json({ error }));
    })

    .catch((error) => res.status(500).json({ error }));
};

// affichage du profil
exports.getProfile = (req, res, next) => {
  const userId = req.user.userId;

  models.User.findOne({
    attributes: ["firstname", "lastname", "email"],
    where: { id: userId },
  })
    .then((user) => {
      if (user) {
        res.status(201).json(user);
      } else {
        res.status(404).json({ error: "Utilisateur non trouvé" });
      }
    })
    .catch((error) =>
      res.status(500).json({ error: "Impossible de trouver l'utilisateur" })
    );
};

// Mise à jour du profil
exports.updateProfile = (req, res, next) => {
  const userId = req.user.userId;

  if (req.files) {
    models.User.findOne({ where: { id: userId } })
      .then((user) => {
        if (req.files.pictures) {
          const pictures = user.pictures.split("/images/")[1];
          if (pictures != undefined) {
            fs.unlink(`images/${pictures}`, (error) => {
              if (error) res.status(400).json({ error });
            });
          }
        }
      })
      .catch((error) => res.status(400).json({ error }));
  }

  const editUser = req.files
    ? {
        ...JSON.parse(req.body.user),
        pictures: req.files.pictures
          ? `${req.protocol}://${req.get("host")}/images/${
              req.files.pictures[0].filename
            }`
          : req.body.pictures,
      }
    : { ...req.body };

  models.User.findOne({
    where: { id: userId },
  })
    .then((user) => {
      user
        .update(editUser)
        .then((user) => {
          if (user) return res.status(201).json(editUser);
          else
            return res
              .status(500)
              .json({ error: "Mis à jour du profil impossible" });
        })
        .catch(() => {
          res.status(500).json({ error: "Mis à jour impossible" });
        });
    })
    .catch(() => res.status(500).json({ error: "Vérification impossible" }));
};

// Suppression du compte utilisateur
exports.deleteUser = (req, res, next) => {
  const userId = req.user.userId;

  models.User.findOne({
    atributes: ["id"],
    where: { id: userId },
  })
    .then((user) => {
      if (user) {
        user
          .destroy()
          .then(() => res.status(200).json({ message: "Compte supprimé !" }))
          .catch((error) => res.status(400).json({ error }));
      } else {
        return res.status(404).json({ error: "Suppression impossible" });
      }
    })
    .catch((error) => res.status(500).json({ error: error }));
};

// modification  du mot de passe
exports.updatePassword = (req, res, next) => {
  const userId = req.user.userId;

  const { oldPassword, newPassword } = req.body;

  models.User.findOne({ id: userId })
    .then((user) => {
      if (!user) {
        return res.status(401).json({ error: "Utilisateur non trouvé" });
      }
      bcrypt
        .compare(oldPassword, user.password)
        .then((valid) => {
          if (!valid) {
            return res.status(401).json({ error: "Mot de passe incorrect" });
          } else {
            bcrypt.hash(newPassword, 10, (err, hash) => {
              user
                .update({
                  password: hash,
                  where: { id: userId },
                })
                .then((user) => {
                  return res.status(201).json({
                    userId: user.id,
                    message: "Mot de passe modifié",
                  });
                })
                .catch((error) =>
                  res.status(500).json({ error: "Modification impossible" })
                );
            });
          }
        })
        .catch((error) =>
          res
            .status(500)
            .json({ error: "Impossible de modifier le mot de passe" })
        );
    })
    .catch((error) =>
      res.status(500).json({ error: "Vérification impossible" })
    );
};

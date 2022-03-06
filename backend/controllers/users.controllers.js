const { log } = require("async");
const bcrypt = require("bcrypt");
const jwt = require("../middlewares/auth");
const models = require("../models/");
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
          let newUser = models.User.create({
            firstname: firstname,
            lastname: lastname,
            email: email,
            password: hash,
            isAdmin: 0,
          })
            .then((newUser) => {
              return res.status(201).json({
                userId: newUser.id,
                message: "Utilisateur créé",
              });
            })
            .catch((error) => res.status(500).json({ error }));
        });
      } else {
        return res.status(409).json({ error: "Utilisateur déjà existant" });
      }
    })
    .catch((error) => res.status(500).json({ error }));
};

// Connexion d'un utilisateur
exports.login = (req, res, next) => {
  const email = req.body.email;
  const password = req.body.password;

  if (email == null || password == null) {
    return res.status(400).json({ error: "Champs manquant(s)" });
  }

  models.User.findOne({
    where: { email: email },
  })
    .then((user) => {
      if (user) {
        bcrypt.compare(password, user.password, (errBycrypt, resBycrypt) => {
          if (resBycrypt) {

            return res.status(200).json({
              userId: user.id,
              token: jwt.generateTokenForUser(user),
            });
          } else {
            return res.status(403).json({ error: "Mot de passe invalide" });
          }
        });
      } else {
        return res.status(404).json({ error: "Utilisateur inexistant" });
      }
    })
    .catch((error) =>
      res.status(500).json({ error: "Vérification impossible" })
    )
    .catch((error) =>
      res.status(500).json({ error: "Vérification impossible" })
    );
};

// affichage du profil
exports.getProfile = (req, res, next) => {
  const headerAuth = req.headers.authorization;
  const userId = jwt.getUserId(headerAuth);

  models.User.findOne({
    attributes: ["id", "firstname", "lastname", "email"],
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
  const headerAuth = req.headers.authorization;
  const userId = jwt.getUserId(headerAuth);

  let firstname = req.body.firstname;
  let lastname = req.body.lastname;
  let email = req.body.email;

  models.User.findOne({
    atributes: ["id", "firstname", "lastname", "email"],
    where: { id: userId },
  })
    .then((user) => {
      if (user) {
        user
          .update({
            firstname: firstname ? firstname : user.firstname,
            lastname: lastname ? lastname : user.lastname,
            email: email ? email : user.email,
          })
          .then((user) => {
            return res.status(201).json({
              userId: user.id,
              message: "Profil mis à jour",
            });
          })
          .catch((error) => res.status(500).json({ error }));
      } else {
        return res.status(409).json({ error: "Mis à jour impossible" });
      }
    })
    .catch((error) => res.status(500).json({ error }));
};

// Suppression du compte utilisateur
exports.deleteUser = (req, res, next) => {
  const headerAuth = req.headers.authorization;
  const userId = jwt.getUserId(headerAuth);

  models.User.findOne({
    atributes: ["id"],
    where: { id: userId },
  })
    .then((user) => {
      if (user) {
        user.destroy()
          .then(() => res.status(200).json({ message: "Compte supprimé !" }))
          .catch((error) => res.status(400).json({ error }));
      } else {
        return res.status(404).json({ error: "Suppression impossible" });
        
      }
    })
    .catch((error) => res.status(500).json({ error: error }));
};

// modification  du mot de passe

const bcrypt = require("bcrypt");
const jwt = require("../utils/jwt.utils");
const models = require("../models/");
require("dotenv").config({ path: "./config/.env" });

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
    firstname.lenght >= 15 &&
      lastname.length <= 2 &&
      lastname.length >= 15 &&
      !firstnameVerify.test(firstname) ||
    !lastnameVerify.test(lastname)
  ) {
    return res
      .status(400)
      .json({ error: " Les informations saisies ne sont pas correctes " });
  }
  if (!emailVerify.test(email)){
    return res.status(400).json({ error : "Adresse mail non valide"})
  }

  if(!passwordVerify.test(password)){
    return res.status(400).json({ error : "Mot de passe invalide"})
  }

  models.User.findOne({
    attributes: ["email"],
    where: { email: email },
  })
    .then((userFound) => {
      if (!userFound) {
        bcrypt.hash(password, 10, (err, bcryptedPassword) => {
          let newUser = models.User.create({
            firstname: firstname,
            lastname: lastname,
            email: email,
            password: bcryptedPassword,
            isAdmin: 0,
          })
            .then((newUser) => {
              return res.status(201).json({
                userId: newUser.id,
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

exports.login = (req, res, next) => {
  const email = req.body.email;
  const password = req.body.password;

  if (email == null || password == null) {
    return res.status(400).json({ error: "Champs manquant(s)" });
  }

  models.User.findOne({
    where: { email: email },
  })
    .then((userFound) => {
      if (userFound) {
        bcrypt.compare(
          password,
          userFound.password,
          (errBycrypt, resBycrypt) => {
            if (resBycrypt) {
              return res.status(200).json({
                userId: userFound.id,
                token: jwt.generateTokenForUser(userFound),
              });
            } else {
              return res.status(403).json({ error: "Mot de passe invalide" });
            }
          }
        );
      } else {
        return res.status(404).json({ error: "Utilisateur inexistant" });
      }
    })
    .catch((error) =>
      res.status(500).json({ error: "Vérification impossible" })
    );

  //   User.findOne({ email: req.body.email })
  //     .then((user) => {
  //       if (!user) {
  //         return res.status(401).json({ error: "Utilisateur non trouvé" });
  //       }
  //       bcrypt
  //         .compare(req.body.password, user.password)
  //         .then((valid) => {
  //           if (!valid) {
  //             return res.status(401).json({ error: "Mot de passe incorrect" });
  //           }
  //           return res.status(200).json({
  //             userId: user._id,
  //             token: jwt.sign({ userId: user._id }, process.env.TOKEN, {
  //               expiresIn: "24h",
  //             }),
  //           });
  //         })
  //         .catch((error) => res.status(500).json({ error }));
  //     })
  //     .catch((error) => res.status(500).json({ error }));
};

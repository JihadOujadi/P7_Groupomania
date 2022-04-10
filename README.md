# P7_Groupomania

Projet 7 du parcours Développeur Web
création d'un réseau social pour l'entreprise Groupomania

Projet développé avec NodeJs, Express, Sequelize et Mysql pour la partie Back-End
VueJs pour la partie Front-End

# Back-End

Clonez le repo puis depuis le dossier backend : 

- npm install
- sequelize init
- sequelize db:create pour créer la base de donnée en la nommant groupomania
- sequelize db:migrate pour créer les migrations

Mysql doit être au préalablement installé sur l'ordinateur.
Une fois Mysql installé, personnalisez le mot de passe (qui n'est pas défini par défaut pour l'utilisateur ROOT) 
Modifiez le mot de passe en tapant : mysqladmin -u root -p password VotreMotDePasse 

Lancez le serveur : 

- nodemon server

# Front-End

Depuis le dossier frontend : 

- npm install
- npm run dev pour lancer l'app
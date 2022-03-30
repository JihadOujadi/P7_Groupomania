<template>
  <main>
    <TheHeader />
    <div class="home">
      <h1>Fil d'actualités</h1>
      <section class="post">
        <div class="post--title">
        <figure class="post--userimg">
          <img :src="userInfo.image" />
          </figure>
          <h2>Dîtes-nous tout...</h2>
        </div>
        <form enctype="multipart/form-data">
          <label for="post"></label>
          <input
            type="text"
            placeholder="Votre titre"
            id="post"
            class="form-row__input"
          />
          <label for="post"></label>
          <input
            type="text"
            placeholder="Saissisez votre texte"
            id="post"
            class="form-row__input__content"
          />
          <input
            type="file"
            name="image"
            accept=".jpg, .jpeg, .png, .gif"
          />
          <div class="button">
            <button class="bouton bouton__image">Ajouter une photo</button>
            <button class="bouton bouton__image">Publier</button>
          </div>
        </form>
      </section>

      <section class="card">
        <article>
          <a href="#">
            <h2 class="card--title">Titre du post</h2>
            <p class="card--title__name">Nom Prénom</p>
            <p class="card--content">Contenu du post</p>
            <figure>
              <img src="@/assets/image-test.jpg" />
            </figure>
          </a>
          <div class="card--social">
            <span>Nombre de likes</span>
            <font-awesome-icon icon="thumbs-up" />
            <span>Nombre de commentaires</span>
            <font-awesome-icon icon="comment" />
          </div>
        </article>
      </section>
    </div>
  </main>
</template>

<script>
import axios from "axios";
import TheHeader from "../components/TheHeader.vue";

export default {
  name: "Profil",
  data() {
    return {
      mode: "profil",
      lastname: "",
      firstname: "",
      email: "",
      error: "",
      user: "",
      token: "",
      userInfo: [],
      postInfo: [],
    };
  },
  components: {
    TheHeader,
  },
  methods: {
    infoProfil() {
      let token = localStorage.getItem("token");
      axios
        .get("http://localhost:8080/api/users/profile", {
          headers: { Authorization: `Bearer ${token}` },
        })
        .then((response) => {
          this.userInfo = response.data;
        })
        .catch((error) => {
          this.error = error.response.data;
        });
    },
    postUser() {
      let token = localStorage.getItem("token");
      axios
        .get("http://localhost:8080/api/users/profile/messages", {
          headers: { Authorization: `Bearer ${token}` },
        })
        .then((response) => {
          this.postInfo = response.data;
        })
        .catch((error) => {
          this.error = error.response.data;
        });
    },
  },
  mounted() {
    this.infoProfil();
    this.postUser();
  },
};
</script>

<style>
main {
  display: flex;
  flex-direction: column;
  align-items: center;
}
.navbar ul {
  display: flex;
  gap: 30px;
}
a {
  text-decoration: none;
  color: #000;
  transition: 0.2s ease-in-out;
}
li a:hover {
  color: #c84b31;
}
li {
  list-style: none;
}
.home {
  display: flex;
  flex-direction: column;
}
.home h1 {
  margin-bottom: 100px;
}
article h2 {
  margin-bottom: 10px;
}
article .content {
  margin-bottom: 20px;
}
.post {
  display: flex;
  flex-direction: column;
  border: 2px solid #ececec;
  max-width: 100%;
  background: white;
  border-radius: 16px;
  margin-bottom: 50px;
  padding-top: 10px;
}
.bouton {
  align-self: center;
}
.post--title h2{
  padding-top: 10px
}
.post--title {
  display: flex;
  justify-content: flex-start;
  margin-left: 15px;
}
.post--userimg {
  width: 120px;
  height: 120px;
  clip-path: ellipse(70% 55%);
  margin-left: 10px
}
.post--userimg img{
  width: 100%
}
form {
  width: 100%;
}
.form-row__input {
  width: 100%;
  margin-top: 10px;
  margin-bottom: 10px;
  padding: 20px;
  border: none;
}
.form-row__input__content {
  width: 100%;
  padding: 60px;
  border: 1px solid #efefef;
  margin-bottom: 15px;
}
.button {
  display: flex;
  justify-content: flex-end;
  padding: 10px;
  gap: 10px;
}
.bouton {
  margin-top: 20px;
  margin-bottom: 5px;
  width: 30%;
}
.bouton__image {
  width: 150px;
  font-size: 13px;
  padding: 10px;
}
.card--title {
  margin-bottom: 0;
}
.card--title,
.card--title__name {
  margin-left: 20px;
}
.card--title__name {
  margin-bottom: 20px;
  color: #525252;
}
.card--content {
  margin-left: 20px;
  margin-bottom: 20px;
}
figure img {
  border-radius: 15px;
}
.card--social {
  display: flex;
  gap: 10px;
  padding: 15px 20px;
}
.card {
  margin-bottom: 25px;
}
</style>

<template>
  <main>
    <TheHeader />
    <div class="home">
      <h1>Fil d'actualités</h1>
      <section class="post">
        <div class="post--title">
          <figure class="user-pic picture picture-content">
            <img
              class="user-pic__img"
              src="@/assets/avatar-default.png"
              v-if="userInfo.image == null"
            />
            <img v-else :src="userInfo.image" alt="user-pic" class="user-pic__img" />
          </figure>
          <h2>Dîtes-nous tout...</h2>
        </div>
        <form enctype="multipart/form-data">
          <label for="title"></label>
          <input
            type="text"
            placeholder="Votre titre"
            id="title"
            class="form-row__input"
            v-model="title"
          />
          <label for="content"></label>
          <textarea
            type="text"
            id="content"
            rows="6"
            cols="33"
            class="form-row__input__content"
            placeholder="Saissisez votre texte"
            v-model="content"
          >
          </textarea>
        </form>
        <div class="form__button">
          <button class="bouton bouton__image" @click.prevent="newPost">Publier</button>
          <div class="form">
            <div class="form--content">
              <img id="file-preview" :src="image" />
              <label class="bouton bouton__image" for="image"> Ajouter une photo </label>
              <input
                type="file"
                id="image"
                ref="file"
                class="input__file"
                accept=".jpg, .jpeg, .png, .gif"
                @change="selectedFile"
              />
            </div>
          </div>
        </div>
      </section>
      <section class="card" v-for="messages in postInfo" :key="messages.id">
        <article class="content-post">
          <a :href="'/post/' + messages.id">
            <div class="content">
              <p class="card--title__name">
                {{ messages.User.lastname }} {{ messages.User.firstname }}
              </p>
              <h2 class="card--title">{{ messages.title }}</h2>
              <p class="card--content">{{ messages.content }}</p>
              <figure>
                <img
                  :src="messages.image"
                  v-if="messages.image !== null"
                  class="content__image"
                />
              </figure>
            </div>
          </a>
          <div class="card--social">
            <span
              >{{ messages.likes }}
              <font-awesome-icon icon="heart" class="liked" v-if="messages.likes >= 1" />
              <font-awesome-icon icon="heart" class="like" v-else />
            </span>
            <span
              >{{ messages.Comments.length }}
              <font-awesome-icon icon="comment" class="commentaire"
            /></span>
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
      comments: [],
      title: "",
      content: "",
      file: "",
      likes: "",
      id: this.$route.params.id,
      image: "",
    };
  },
  components: {
    TheHeader,
  },
  methods: {
    async infoProfil() {
      let token = localStorage.getItem("token");
      await axios
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
    selectedFile(event) {
      this.FILE = event.target.files[0];
    },
    async newPost() {
      let token = localStorage.getItem("token");
      const formData = new FormData();
      if (this.FILE == null) {
        formData.append("title", this.title);
        formData.append("content", this.content);
      } else {
        formData.append("title", this.title);
        formData.append("content", this.content);
        formData.append("image", this.FILE, this.FILE.name);
      }

      await axios
        .post("http://localhost:8080/api/posts/new", formData, {
          headers: { Authorization: `Bearer ${token}` },
        })
        .then((response) => {
          document.location.reload();
        })
        .catch((error) => {
          this.error = error.response.data;
        });
    },
    async allPost() {
      await axios
        .get("http://localhost:8080/api/posts")
        .then((response) => {
          console.log(response.data);
          this.postInfo = response.data;
        })
        .catch((error) => {
          console.log(response.data);
          this.error = error.response.data;
        });
    },
    async getComment() {
      let token = localStorage.getItem("token");
      await axios
        .get("http://localhost:8080/api/posts/" + this.id + "/comment", {
          headers: { Authorization: `Bearer ${token}` },
        })
        .then((response) => {})
        .catch((error) => {
          this.error = error.response.data;
        });
    },
  },
  mounted() {
    this.infoProfil();
    this.allPost();
    this.getComment();
  },
};
</script>

<style>
main {
  display: flex;
  flex-direction: column;
  align-items: center;
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
  max-width: 700px;
  width: 100%;
}
.home h1 {
  margin-bottom: 100px;
}
article h2 {
  margin-bottom: 10px;
}
.content-post {
  display: flex;
  flex-direction: column;
}
.post {
  display: flex;
  flex-direction: column;
  border: 2px solid #ececec;
  background: white;
  border-radius: 16px;
  margin-bottom: 50px;
  padding-top: 10px;
}
textarea {
  resize: none;
}
.bouton {
  align-self: center;
}
.post--title h2 {
  padding-top: 10px;
}
.post--title {
  display: flex;
  justify-content: flex-start;
  align-items: center;
  margin-left: 15px;
}
.picture {
  width: 40px;
  height: 40px;
}
.picture-content {
  padding: 0;
  margin-right: 10px;
}
.user-pic {
  position: relative;
  display: flex;
  justify-content: center;
  align-items: center;
  border-radius: 50%;
  overflow: hidden;
}
.user-pic__img {
  width: 100%;
  height: 100%;
  object-fit: cover;
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
  padding: 10px;
  border: 1px solid #efefef;
  margin-bottom: 15px;
}
.form-input {
  width: 350px;
  padding: 20px;
  background: #fff;
  box-shadow: -3px -3px 7px rgba(94, 104, 121, 0.377),
    3px 3px 7px rgba(94, 104, 121, 0.377);
}
.form img {
  width: 100%;
  display: none;
  margin-bottom: 30px;
  border-radius: 20px;
}
.form input {
  display: none;
}
.form label {
  display: block;
  width: 150px;
  text-align: center;
  background: #fff;
  color: #c84b31;
  font-size: 13px;
  border-radius: 10px;
  cursor: pointer;
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
.form__button {
  display: flex;
  flex-direction: row-reverse;
  align-items: center;
  gap: 10px;
  margin-bottom: 5px;
  margin-right: 5px;
}
.input--file {
  color: #c84b31;
}
.card--title {
  margin-bottom: 0;
}
.card--title,
.card--title__name {
  margin-left: 20px;
}
.card--title__name {
  margin-bottom: 10px;
  color: #525252;
}
.card--content {
  margin-left: 20px;
  padding-bottom: 10px;
}
figure {
  max-width: 700px;
}
figure img {
  border-radius: 15px;
}
img {
  width: 100%;
}
.content__image {
  object-fit: cover;
  width: 100%;
  height: 100%;
}
.content__image__null {
  display: none;
}
.card--social {
  display: flex;
  gap: 10px;
  align-items: center;
  margin-top: 10px;
  margin-left: 10px;
}
.like,
.commentaire,
.liked {
  font-size: 19px;
  margin-left: 3px;
}
.liked {
  color: #fd5d5d;
}
.bouton-like {
  border: none;
}
.card {
  margin-bottom: 40px;
}
.settings {
  border: none;
  background: none;
  cursor: pointer;
  font-size: 28px;
}
.bouton--settings {
  background: none;
  cursor: pointer;
  font-size: 20px;
  width: 150px;
  font-size: 13px;
  padding: 10px;
}
.form--content input[type="file"] {
  position: absolute;
  opacity: 1;
  transform: translate(-3px, -50%);
  cursor: pointer;
  padding: 10px 20px;
}
@media screen and (max-width: 768px) {
  .home h1 {
    margin-left: 20px;
  }
  figure {
    margin: 0 10px;
  }
  .card--social {
    margin-left: 25px;
  }
  .bouton {
    width: 100%;
  }
}
</style>

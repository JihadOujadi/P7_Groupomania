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
          <button class="bouton bouton__image" @click="upload = !upload">
            Ajouter une photo
          </button>
          <div class="form">
            <transition name="fade">
              <form enctype="multipart/form-data" v-if="upload">
                <div class="form--content">
                  <input
                    type="file"
                    ref="file"
                    class="input__file"
                    accept=".jpg, .jpeg, .png, .gif"
                    @change="selectedFile"
                  />
                </div>
              </form>
            </transition>
          </div>
        </div>
      </section>
      <section class="card" v-for="messages in postInfo" :key="messages.id">
        <article>
          <a :href="'/post/' + messages.id">
            <div class="content">
              <h2 class="card--title">{{ messages.title }}</h2>
              <p class="card--title__name">
                {{ messages.User.lastname }} {{ messages.User.firstname }}
              </p>
              <p class="card--content">{{ messages.content }}</p>
              <figure>
                <img :src="messages.image" />
              </figure>
            </div>
            <div class="card--social">
              <span>{{ messages.likes.length }}</span>
              <font-awesome-icon icon="thumbs-up" />
              <span>Nombre de commentaires</span>
              <font-awesome-icon icon="comment" />
            </div>
          </a>
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
      upload: false,
      title: "",
      content: "",
      file: "",
      likes: "",
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
    selectedFile(event) {
      this.FILE = event.target.files[0];
    },
    newPost() {
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

      axios
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
    allPost() {
      axios
        .get("http://localhost:8080/api/posts")
        .then((response) => {
          console.log(response.data);
          this.postInfo = response.data;
        })
        .catch((error) => {
          this.error = error.response.data;
        });
    },
  },
  mounted() {
    this.infoProfil();
    this.allPost();
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
.post {
  display: flex;
  flex-direction: column;
  border: 2px solid #ececec;
  background: white;
  border-radius: 16px;
  margin-bottom: 50px;
  padding-top: 10px;
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
  margin-left: 15px;
}
.post--userimg {
  width: 120px;
  height: 120px;
  clip-path: ellipse(70% 55%);
  margin-left: 10px;
}
.post--userimg img {
  width: 100%;
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
.form {
  display: flex;
  justify-content: flex-end;
  padding: 10px;
  gap: 10px;
  width: 100px;
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
.card--social {
  display: flex;
  gap: 10px;
  align-items: center;
}
.card {
  margin-bottom: 40px;
}
.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.5s;
}
.fade-enter,
.fade-leave-to {
  opacity: 0;
}
</style>

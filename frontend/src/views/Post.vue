<template>
  <main>
    <TheHeader />
    <div class="home">
      <section class="card">
        <article>
          <p class="card--title__name">{{ user.lastname }} {{ user.firstname }}</p>
          <h2 class="card--title">{{ postInfo.title }}</h2>
          <p class="card--content">{{ postInfo.content }}</p>
          <figure>
            <img :src="postInfo.image" />
          </figure>
          <div class="card--social">
            <span>Nombre de likes</span>
            <button class="post-comment">
              <font-awesome-icon icon="thumbs-up" />
            </button>
          </div>
          <div class="update-form" v-if="idUser == postInfo.userId">
            <button class="settings" @click="settings = !settings">...</button>
            <div class="bouton--update">
              <button
                class="bouton bouton--settings"
                @click="update = !update"
                v-if="settings"
              >
                Modifier le post
              </button>
              <button
                class="bouton bouton--settings"
                v-if="settings"
                @click="deletePost()"
              >
                Supprimer le post
              </button>
            </div>
            <transition name="fade">
              <form enctype="multipart/form-data" v-if="update">
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
                <div class="form--content">
                  <input
                    type="file"
                    ref="file"
                    class="input__file"
                    accept=".jpg, .jpeg, .png, .gif"
                    @change="selectedFile"
                  />
                </div>
                <button class="bouton bouton--settings" @click.prevent="updatePost">
                  Mettre à jour
                </button>
              </form>
            </transition>
          </div>
          <div class="card--comment">
            <span class="user-pic picture picture-content">
              <img :src="userInfo.image" class="user-pic__img" />
            </span>
            <div class="comments">
              <label for="comment"></label>
              <textarea
                type="text"
                id="comment"
                rows="1"
                cols="20"
                v-model="comment"
                placeholder="Votre commentaire..."
                class="form-row__input"
              >
              </textarea>
              <button class="post-comment" type="submit" @click="newComment()">
                <font-awesome-icon icon="paper-plane" class="send" />
              </button>
            </div>
          </div>
          <div
            class="card--content"
            v-for="userComment in comments"
            :key="userComment.id"
          >
            <span>
              <p>{{ userComment.User.firstname }}</p>
              <p>{{ userComment.comment }}</p>
              <p>{{ userComment.createdAt }}</p>
            </span>
          </div>
        </article>
      </section>
    </div>
  </main>
</template>

<script>
import axios from "axios";
import TheHeader from "../components/TheHeader.vue";

const paramsId = new URLSearchParams(location.search);

const id = paramsId.get("id");

export default {
  name: "Post",
  data() {
    return {
      title: "",
      content: "",
      image: "",
      lastname: "",
      firstname: "",
      token: "",
      user: "",
      id: this.$route.params.id,
      comment: "",
      comments: [],
      postInfo: [],
      userInfo: [],
      update: false,
      settings: false,
      idUser: localStorage.getItem("user"),
      isAdmin: "",
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
    onePost() {
      let token = localStorage.getItem("token");
      axios
        .get("http://localhost:8080/api/posts/" + this.id, {
          headers: { Authorization: `Bearer ${token}` },
        })
        .then((response) => {
          this.postInfo = response.data;
          this.user = response.data.User;
        })
        .catch((error) => {
          this.error = error.response.data;
        });
    },
    getComment() {
      let token = localStorage.getItem("token");
      axios
        .get("http://localhost:8080/api/posts/" + this.id + "/comment", {
          headers: { Authorization: `Bearer ${token}` },
        })
        .then((response) => {
          this.comments = response.data;
        });
    },
    newComment() {
      let token = localStorage.getItem("token");
      const data = {
        comment: this.comment,
      };
      axios
        .post("http://localhost:8080/api/posts/" + this.id + "/comment", data, {
          headers: { Authorization: `Bearer ${token}` },
        })
        .then((response) => {
          document.location.reload();
        })
        .catch((error) => {
          this.error = error.response.data;
        });
    },
    deletePost() {
      let token = localStorage.getItem("token");
      axios
        .delete("http://localhost:8080/api/posts/" + this.id, {
          headers: { Authorization: `Bearer ${token}` },
        })
        .then((response) => {
          this.$router.push("/");
        })
        .catch((error) => {
          this.error = error.response.data;
        });
    },
    selectedFile(event) {
      this.FILE = event.target.files[0];
    },
    updatePost() {
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
        .put("http://localhost:8080/api/posts/" + this.id, formData, {
          headers: { Authorization: `Bearer ${token}` },
        })
        .then((response) => {
          document.location.reload();
        })
        .catch((error) => {
          this.error = error.response.data;
        });
    },
    likePost() {},
  },
  mounted() {
    this.infoProfil();
    this.onePost();
    this.getComment();
  },
};
</script>

<style scoped>
.card--comment {
  display: flex;
  align-items: center;
  gap: 5px;
  margin-top: 20px;
}
.picture {
  width: 40px;
  height: 36px;
}
.picture-content {
  padding: 0;
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
.form-row__input {
  padding: 8px;
  border: none;
  border-radius: 8px;
  background: #f2f2f2;
  font-weight: 500;
  font-size: 16px;
  color: black;
}
textarea {
  resize: none;
}
.comments {
  display: flex;
  align-items: center;
  width: 90%;
}
.send {
  font-size: 20px;
}
svg {
  stroke: blue;
  stroke-width: 15px;
}
.post-comment {
  border: none;
  background: none;
  cursor: pointer;
  margin-left: 20px;
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

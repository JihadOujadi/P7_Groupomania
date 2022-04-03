<template>
  <main>
    <TheHeader />
    <div class="home">
      <section class="card">
        <article>
          <!-- Post -->
          <div class="card--info__post">
            <p class="card--title__name">{{ user.lastname }} {{ user.firstname }}</p>
            <h2 class="card--title">{{ postInfo.title }}</h2>
            <p class="card--content">{{ postInfo.content }}</p>
            <figure>
              <img :src="postInfo.image" />
            </figure>
          </div>
          <!-- Like et commentaires -->
          <div class="card--info__bottom">
            <!-- Likes -->
            <div class="card--like">
              <span
                >like
                <button class="post-comment">
                  <font-awesome-icon
                    icon="thumbs-up"
                    class="like"
                    @click.prevent="likePost"
                  />
                </button>
              </span>
              <span
                >{{ comments.length }}
                <font-awesome-icon icon="comment" class="commentaire"
              /></span>
            </div>

            <!-- Update et suppression posts -->
            <div class="update-form">
              <button
                class="settings"
                @click="settings = !settings"
                v-if="idUser == postInfo.userId || userInfo.isAdmin"
              >
                ...
              </button>
              <div class="bouton--update">
                <button
                  class="bouton bouton--settings"
                  @click="update = !update"
                  v-if="settings"
                >
                  Modifier le post
                </button>
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
                <button
                  class="bouton bouton--settings"
                  v-if="settings"
                  @click="deletePost()"
                >
                  Supprimer le post
                </button>
              </div>
            </div>
          </div>
          <!-- Commentaires -->
          <div class="card--comment">
            <div class="card--comment__form">
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
            <!-- Commentaires utilisateurs -->
            <div
              class="card--comment__user"
              v-for="userComment in comments"
              :key="userComment.id"
            >
              <span>
                <p class="card--comment__title">
                  <strong>{{ userComment.User.firstname }}</strong>
                </p>
                <p class="card--comment__comment">" {{ userComment.comment }} "</p>
                <p class="card--comment__date">{{ userComment.createdAt }}</p>
              </span>
            </div>
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
      likeNumber: "",
      comments: [],
      postInfo: [],
      userInfo: [],
      update: false,
      settings: false,
      idUser: localStorage.getItem("user"),
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
    async onePost() {
      let token = localStorage.getItem("token");
      await axios
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
    async getComment() {
      let token = localStorage.getItem("token");
      await axios
        .get("http://localhost:8080/api/posts/" + this.id + "/comment", {
          headers: { Authorization: `Bearer ${token}` },
        })
        .then((response) => {
          this.comments = response.data;
        });
    },
    async newComment() {
      let token = localStorage.getItem("token");
      const data = {
        comment: this.comment,
      };
      await axios
        .post("http://localhost:8080/api/posts/" + this.id + "/comment", data, {
          headers: { Authorization: `Bearer ${token}` },
        })
        .then((response) => {
          this.comment = "";
          this.getComment();
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
    async updatePost() {
      let token = localStorage.getItem("token");
      const formData = new FormData();
      if (this.FILE == null) {
        formData.set("title", this.title);
        formData.set("content", this.content);
      } else {
        formData.set("title", this.title);
        formData.set("content", this.content);
        formData.set("image", this.FILE, this.FILE.name);
      }
      await axios
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
    likePost() {
      let token = localStorage.getItem("token");
      axios
        .post(
          "http://localhost:8080/api/posts/" + this.id + "/like",
          {},
          {
            headers: { Authorization: `Bearer ${token}` },
          }
        )
        .then((response) => {
          console.log(response);
        })
        .catch((error) => {});
    },
  },
  mounted() {
    this.infoProfil();
    this.onePost();
    this.getComment();
  },
};
</script>

<style scoped>
.picture {
  width: 40px;
  height: 37px;
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
.card--info__bottom {
  display: flex;
  align-items: center;
  justify-content: space-between;
  width: 100%;
  margin-top: 10px;
}
.update-form {
  display: flex;
  gap: 10px;
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
.card--like {
  display: flex;
  align-items: center;
  gap: 20px;
}

.like {
  font-size: 23px;
}
.commentaire {
  font-size: 23px;
  margin-right: 10px;
}
.like,
.commentaire {
  margin-left: 7px;
}
.card--comment {
  display: flex;
  flex-direction: column;
  gap: 5px;
  margin-top: 20px;
  width: 100%;
  line-height: 30px;
}
textarea {
  resize: none;
}
.card--comment__form {
  display: flex;
  align-items: center;
  width: 100%;
}
.comments {
  display: flex;
  align-items: center;
  width: 100%;
}
.send {
  font-size: 20px;
}
.post-comment {
  border: none;
  background: none;
  cursor: pointer;
  margin-left: 20px;
}
.card--comment__user {
  margin-top: 15px;
  background: #f2f2f2;
  border: 1px solid #f2f2f2;
  border-radius: 15px;
  padding: 10px;
}
.card--comment__date {
  font-size: 12px;
}
.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.6s;
}
.fade-enter,
.fade-leave-to {
  opacity: 0;
}
</style>

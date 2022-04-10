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
              <label class="post-comment" for="like">
                <span>{{ postInfo.likes }}</span>
                <input type="checkbox" id="like" @click.prevent="likePost" />
                <font-awesome-icon icon="heart" class="like" />
              </label>

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
                  v-if="settings && idUser == postInfo.userId"
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
                      name="title"
                      class="form-row__input"
                      v-model="title"
                    />
                    <label for="content"></label>
                    <textarea
                      type="text"
                      id="content"
                      name="content"
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
                <img
                  class="user-pic__img"
                  src="@/assets/avatar-default.png"
                  v-if="userInfo.image == null"
                />
                <img v-else :src="userInfo.image" alt="user-pic" class="user-pic__img" />
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
            <Comment :comments="comments" :userInfo="userInfo" />
          </div>
        </article>
      </section>
    </div>
  </main>
</template>

<script>
import axios from "axios";
import TheHeader from "../components/TheHeader.vue";
import Comment from "../components/Comment.vue";

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
      postInfo: [],
      userInfo: [],
      comments: [],
      update: false,
      settings: false,
      idUser: localStorage.getItem("user"),
    };
  },
  components: {
    TheHeader,
    Comment,
  },
  methods: {
    async infoProfil() {
      let token = localStorage.getItem("token");
      await axios
        .get("http://localhost:8080/api/users/profile", {
          headers: { Authorization: `Bearer ${token}` },
        })
        .then((response) => {
          console.log(response.data);
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
          console.log(response.data);
          this.postInfo = response.data;
          this.user = response.data.User;
          this.title = response.data.title;
          this.content = response.data.content;
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
          this.onePost();
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
        formData.set("title", this.title);
        formData.set("content", this.content);
        formData.set("image", this.FILE, this.FILE.name);
      }
      axios
        .put("http://localhost:8080/api/posts/" + this.id, formData, {
          headers: { Authorization: `Bearer ${token}` },
        })
        .then((response) => {
          console.log(response);
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
          this.onePost();
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

<style>
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
.card--like input {
  display: none;
}
.like {
  font-size: 20px;
  transition: 0.3s ease-in-out;
}
.like:hover {
  color: #fd5d5d;
}
.card--like input:checked + .like {
  color: red;
}
.commentaire {
  font-size: 20px;
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
  transition: 0.2s ease-in-out;
}
.send:hover {
  color: #5d8bf4;
}
.post-comment {
  border: none;
  background: none;
  cursor: pointer;
  margin-left: 10px;
}
.card--like span {
  font-size: 16px;
}
.card--comment__user {
  margin-top: 15px;
  background: #f2f2f2;
  border: 1px solid #f2f2f2;
  border-radius: 15px;
  padding: 10px;
  display: flex;
  justify-content: space-between;
}
.card--comment__date {
  font-size: 12px;
}
.delete-comment {
  border: none;
  align-self: flex-end;
  cursor: pointer;
  transition: 0.2s ease-in-out;
  font-size: 12px;
}
.delete-comment:hover {
  color: #c84b31;
}
.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.6s;
}
.fade-enter,
.fade-leave-to {
  opacity: 0;
}

@media screen and (max-width: 768px) {
  .card--info__bottom {
    padding: 0 20px;
    margin: 0;
  }
  .card--comment {
    padding: 0 20px;
  }
}
</style>

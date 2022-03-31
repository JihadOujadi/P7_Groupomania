<template>
  <main>
    <TheHeader />
    <div class="home">
      <section class="card">
        <article>
          <h2 class="card--title">{{ postInfo.title }}</h2>
          <p class="card--title__name">{{ user.lastname }} {{ user.firstname }}</p>
          <p class="card--content">{{ postInfo.content }}</p>
          <figure>
            <img :src="postInfo.image" />
          </figure>
          <div class="card--social">
            <span>Nombre de likes</span>
            <font-awesome-icon icon="thumbs-up" />
          </div>
          <div class="card--comment">
            <p>Nom de l'utilisateur</p>
            <label for="content"></label>
            <textarea
              type="text"
              id="content"
              rows="1"
              cols="10"
              class="form-row__input__content"
              placeholder="Saissisez votre texte"
              v-model="content"
            >
            </textarea>
          </div>
          <div
            class="card--content"
            v-for="userComment in comments"
            :key="userComment.id"
          >
            {{ userComment.comment }}
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
      mode: "post",
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
    };
  },
  components: {
    TheHeader,
  },
  methods: {
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
        .get("http://localhost:8080/api/posts/comment/" + this.id, {
          headers: { Authorization: `Bearer ${token}` },
        })
        .then((response) => {
          console.log(response.data);
          this.comments = response.data;
        });
    },
  },
  mounted() {
    this.onePost();
    this.getComment();
  },
};
</script>

<style scoped>
.card--comment {
  display: flex;
  flex-direction: column;
  gap: 10px;
  margin-top: 20px;
}
</style>

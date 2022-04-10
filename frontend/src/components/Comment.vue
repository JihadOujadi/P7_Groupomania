<template>
  <div
    class="card--comment__user"
    :id="userComment.id"
    v-for="userComment in comments"
    :key="userComment.id"
  >
    <span>
      <p class="card--comment__title">
        <strong>{{ userComment.User.firstname }}</strong>
      </p>
      <p class="card--comment__comment">" {{ userComment.comment }} "</p>
      <p class="card--comment__date">
        {{ dateParser(userComment.createdAt) }}
      </p>
    </span>
    <button
      class="delete-comment"
      @click="deleteComment(userComment.id)"
      v-if="userInfo.isAdmin"
    >
      Supprimer le commentaire
    </button>
  </div>
</template>

<script>
import axios from "axios";
const paramsId = new URLSearchParams(location.search);

const id = paramsId.get("id");

export default {
  name: "DeleteComment",
  data() {
    return {
      token: "",
      id: this.$route.params.id,
    };
  },
  props: {
    comments: Object,
    userInfo: Object,
  },
  methods: {
    async deleteComment(commentId) {
      let token = localStorage.getItem("token");
      await axios
        .delete("http://localhost:8080/api/posts/" + this.id + "/comment/" + commentId, {
          headers: { Authorization: `Bearer ${token}` },
        })
        .then((response) => {
          console.log(response.data);
          console.log(this.comments);
          document.location.reload();
        })
        .catch((error) => {
          this.error = error.response.data;
        });
    },
    dateParser(num) {
      let options = {
        hour: "2-digit",
        minute: "2-digit",
        weekday: "long",
        year: "numeric",
        month: "short",
        day: "numeric",
      };

      let timestamp = Date.parse(num);

      let date = new Date(timestamp).toLocaleDateString("fr-FR", options);

      return date.toString();
    },
  },
  mounted() {},
};
</script>

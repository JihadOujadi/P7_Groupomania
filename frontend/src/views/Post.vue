<template>
  <main>
    <TheHeader />
    <div class="home">
      <section class="card">
        <article>
          <a href="#">
            <h2>Nom du user</h2>
            <p class="content">Contenu du post</p>
            <figure>
              <img src="@/assets/image-test.jpg" />
            </figure>
          </a>
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
        </article>
      </section>
    </div>
  </main>
</template>

<script>
import axios from "axios";
import TheHeader from "../components/TheHeader.vue";

export default {
  name: "Post",
  data() {
    return {
      mode: "post",
      title: "",
      content: "",
      image: "",
      messageId: "",
    };
  },
  components: {
    TheHeader,
  },
  methods: {},
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

<template>
  <main>
    <TheHeader />
    <div class="card">
      <section class="card--info">
        <article>
          <h1>Votre profil</h1>
          <figure class="user-pic picture picture-content">
            <img class="user-pic__img" :src="userInfo.image" />
          </figure>
          <button @click="upload = !upload" class="bouton bouton__image">
            Modifier l'image
          </button>
          <transition name="fade">
            <form
              enctype="multipart/form-data"
              @submit.prevent="updateImage"
              v-if="upload"
            >
              <div class="form">
                <input
                  type="file"
                  name="image"
                  class="input__file"
                  accept=".jpg, .jpeg, .png, .gif"
                  @change="fileUpload"
                />
              </div>
              <button class="bouton bouton__upload">Valider</button>
            </form>
          </transition>
        </article>
        <div class="card--info__user">
          <div class="card--info__name">
            <p>{{ userInfo.lastname }}</p>
            <p>{{ userInfo.firstname }}</p>
          </div>
          <button @click="show = !show" class="bouton bouton__update">
            Modifier mon profil
          </button>
          <transition name="fade">
            <div v-if="show">
              <UpdateProfil />
            </div>
          </transition>
          <button @click="deleteAccount()" class="bouton bouton__disconnect">
            Supprimer mon compte
          </button>
        </div>
      </section>
      <hr />
      <section class="card--post">
        <div v-for="messages in postInfo" :key="messages.id" class="card--post__element">
          <a href="#">
            <img :src="messages.image" />
          </a>
        </div>
      </section>
    </div>
  </main>
</template>

<script>
import axios from "axios";
import TheHeader from "../components/TheHeader.vue";
import UpdateProfil from "../components/UpdateProfil.vue";

export default {
  name: "Profil",
  data() {
    return {
      mode: "profil",
      lastname: "",
      firstname: "",
      email: "",
      image: "",
      error: "",
      user: "",
      token: "",
      userInfo: [],
      postInfo: [],
      show: false,
      upload: false,
    };
  },
  components: {
    TheHeader,
    UpdateProfil,
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
    deleteAccount() {
      let token = localStorage.getItem("token");
      axios
        .delete("http://localhost:8080/api/users/delete-profile", {
          headers: { Authorization: `Bearer ${token}` },
        })
        .then((response) => {
          alert("Votre compte est supprimé !");
          localStorage.clear();
          this.$router.push("/login");
        })
        .catch((error) => {
          console.log(error);
        });
    },
    fileUpload(event) {
      this.FILE = event.target.files[0];
    },
    updateImage() {
      let token = localStorage.getItem("token");
      const formData = new FormData();

      formData.append("image", this.FILE, this.FILE.name);

      axios
        .post("http://localhost:8080/api/users/upload", formData, {
          headers: { Authorization: `Bearer ${token}` },
        })
        .then((response) => {
          document.location.reload();
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

<style scoped>
header {
  display: flex;
  justify-content: space-between;
  padding: 30px 50px;
  width: 100%;
  margin-bottom: 100px;
}
.navbar ul {
  display: flex;
  gap: 30px;
}
a {
  text-decoration: none;
  color: #000;
}
li {
  list-style: none;
}
.card {
  background: none;
  width: 100%;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
}
.card--info {
  display: flex;
  gap: 10px;
  width: 500px;
}
article {
  width: 300px;
  display: flex;
  flex-direction: column;
  align-items: center;
  padding-right: 60px;
}
article > h1 {
  margin-bottom: 20px;
  align-self: center;
}
.picture {
  width: 90px;
  height: 90px;
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
.bouton__image {
  font-size: 13px;
  width: 150px;
  margin-top: 45px;
  padding: 5px;
  align-self: center;
}
.form {
  width: 100px;
}
.input--file {
  color: #c84b31;
}
.bouton__upload {
  font-size: 13px;
  width: 150px;
  margin-top: 18px;
  padding: 5px;
  align-self: center;
}
.card--info__user {
  display: flex;
  flex-direction: column;
  flex-wrap: nowrap;
  width: 100%;
}
.card--info__name {
  display: flex;
  gap: 10px;
}
.bouton__update {
  margin-top: 50px;
  margin-bottom: 10px;
  width: 100%;
}
.bouton__disconnect {
  width: 100%;
}
hr {
  border: 1px solid #000;
  width: 30%;
  margin-top: 50px;
}
.card--post {
  margin-top: 50px;
}
.card--post img {
  width: 40%;
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

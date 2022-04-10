<template>
  <header>
    <router-link to="/">
      <img src="@/assets/groupomania-logo-inline.png" alt="Groupomania" />
    </router-link>
    <nav class="navbar">
      <ul class="navbar--list">
        <li class="navbar--list__element">
          <span class="user-pic picture picture-content">
            <img
              class="user-pic__img"
              src="@/assets/avatar-default.png"
              v-if="userInfo.image == null"
            />
            <img v-else :src="userInfo.image" alt="user-pic" class="user-pic__img" />
          </span>
          <p>
            <strong> {{ userInfo.firstname }} </strong>
          </p>
        </li>
        <li class="navbar--list__element">
          <router-link to="/profil">Profil</router-link>
        </li>
        <li class="navbar--list__element">
          <router-link to="/login" @click="logOut()">Déconnexion</router-link>
        </li>
      </ul>
    </nav>
  </header>
</template>

<script>
import axios from "axios";

export default {
  name: "Theheader",
  data() {
    return {
      token: "",
      userInfo: [],
    };
  },
  methods: {
    logOut() {
      localStorage.clear();
      this.$router.push("/login");
    },
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
  },
  mounted() {
    this.infoProfil();
  },
};
</script>

<style scoped>
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

.navbar--list__element {
  display: flex;
  align-items: center;
  justify-content: flex-end;
}
.picture {
  width: 40px;
  height: 39px;
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
@media screen and (max-width: 768px) {
  header {
    flex-direction: column;
  }
  .navbar {
    display: flex;
    justify-content: center;
    align-items: center;
    margin-top: 20px;
  }
}
</style>

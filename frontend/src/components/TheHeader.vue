<template>
  <header>
    <router-link to="/">
      <img src="@/assets/groupomania-logo-inline.png" alt="Groupomania" />
    </router-link>
    <nav class="navbar">
      <ul class="navbar--list">
        <li class="navbar--list__element">
          <img :src="userInfo.image" alt="user-pic" class="user-pic" />
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
  },
  mounted() {
    this.infoProfil();
  },
};
</script>

<style>
.navbar--list__element {
  display: flex;
  align-items: center;
  justify-content: flex-end;
}
.user-pic {
  width: 35px;
  margin-right: 10px;
  clip-path: ellipse(70% 55%);
}
</style>

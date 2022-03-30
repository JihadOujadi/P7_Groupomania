<template>
  <header>
  <router-link to="/">
      <img src="@/assets/groupomania-logo-inline.png" alt="Groupomania" />
      </router-link>
      <nav class="navbar">
        <ul class="navbar--list">
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
    };
  },
  methods: {
    logOut() {
      localStorage.clear();
      this.$router.push("/login");
    }
  }
};
</script>
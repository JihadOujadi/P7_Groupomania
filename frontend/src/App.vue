<script setup>
import { RouterLink, RouterView } from "vue-router";
</script>

<template>
  <RouterView />
</template>

<style>
@import url("https://fonts.googleapis.com/css2?family=Poppins:wght@400;500;800&display=swap");
@import "@/assets/base.css";

* {
  font-family: "Poppins", sans-serif;
  margin: 0;
  padding: 0;
  box-sizing: border-box;
}

#app {
  max-width: 100%;
}

body {
  display: flex;
  align-items: center;
  justify-content: center;
  min-height: 100vh;
}
.card {
  display: flex;
  flex-wrap: wrap;
  justify-content: center;
  max-width: 100%;
  width: 550px;
  background: white;
  border-radius: 16px;
  padding: 40px;
}
</style>

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
  width: 100%;
}

body {
  min-height: 100vh;
  padding: 25px;
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
.bouton {
  background: #2196f3;
  border-radius: 10px;
  width: 100%;
  padding: 15px;
  color: #fff;
  border: none
}
.bouton:hover{
  background: #56BBF1;
}
.bouton--disabled {
  background: #cecece;
  color: #ececec;
}
.bouton--disabled{
  background: #cecece;
  color: #cecece;
}
.bouton--disabled:hover{
  cursor: not-allowed;
  background: #cecece;
}
</style>

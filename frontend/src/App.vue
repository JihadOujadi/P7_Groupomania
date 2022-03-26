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
  padding: 0;
  margin: 0;
  background: #f8f8f8; 
}
header {
  display: flex;
  justify-content: space-between;
  padding: 30px 50px;
  width: 100%;
  margin-bottom: 100px;
  border-bottom: 2px solid #D1D1D1;
  background: #F5F5F5
}
.bouton {
  border-radius: 10px;
  background: #fff;
  color: #C84B31;
  width: 100%;
  padding: 15px;
  font-size: 15px;
  border: 2px solid #C84B31;
  transition: .2s ease-in-out;
}
.bouton:hover{
  background: #C84B31;
  color: #fff;
  border: 2px solid #C84B31;
  cursor: pointer
}
.bouton--disabled {
  background: #cecece;
  border: 2px solid #ececec;
  color: #ececec;
}
.bouton--disabled:hover{
  cursor: not-allowed;
  background: #cecece;
  color: #ececec;
  border: 2px solid #ececec;
}
</style>

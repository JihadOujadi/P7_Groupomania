<template>
  <main>
    <header>
      <img src="@/assets/groupomania-logo-inline.png" alt="Groupomania" />
      <nav class="navbar">
        <ul class="navbar--list">
          <li class="navbar--list__element">
            <a href="#">Accueil</a>
          </li>
          <li class="navbar--list__element">
            <a href="#">Déconnexion</a>
          </li>
        </ul>
      </nav>
    </header>

    <div class="card">
      <section class="card--info">
        <article>
          <h1>Votre profil</h1>
          <figure>
            <img />
          </figure>
        </article>
        <div class="card--info__user">
          <div class="card--info__name">
            <p>{{ userInfo.lastname }}</p>
            <p>{{ userInfo.firstname }}</p>
          </div>
          <button class="bouton bouton__update">Modifier mon profil</button>
          <button class="bouton bouton__disconnect">
            Supprimer mon compte
          </button>
        </div>
      </section>
      <hr />
      <section class="card--post">
        <a href="#" class="card--post__element">
          <img src="@/assets/image-test.jpg" />
        </a>
      </section>
    </div>
  </main>
</template>

<script>
import axios from 'axios';

export default {
  name: "Profil",
  data() {
    return {
      mode: "profil",
      lastname: "",
      firstname: "",
      email:"",
      error: "",
      user: "",
      token: "",
      userInfo: [],
    };
  },
  methods: {
    infoProfil(){
      let token = localStorage.getItem("token");
      axios.get("http://localhost:8080/api/users/profile" , {
        headers: { Authorization : `Bearer ${token}` },
      })
      .then((response) => {
        console.log(response.data);
        this.userInfo = response.data;
      })
      .catch((error) => {
          this.error = error.response.data;
        });

    }
  },
  mounted() {
    this.infoProfil();
  }
}
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
  gap: 60px;
}
.card--info__user{
  display: flex;
  flex-direction: column; 
  flex-wrap: nowrap; 
}
.card--info__name {
  display: flex;
  gap: 10px;
}
.bouton__update {
  margin-top: 20px;
  margin-bottom: 10px;
  width: 100%;
}
.bouton__disconnect{
  width: 100%
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
</style>

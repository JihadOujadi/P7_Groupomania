<template>
  <main>
    <img src="@/assets/groupomania-logo.png" alt="Groupomania" class="logo" />
    <div class="card">
      <h1 v-if="mode == 'login'">Connexion</h1>
      <h1 v-else>Inscription</h1>
      <p v-if="mode == 'login'">
        Vous n'êtes pas encore inscrit ?
        <span class="card__action" @click="switchToInscription()"
          >S'inscrire</span
        >
      </p>
      <p v-else>
        Vous avez déjà un compte ?
        <span class="card__action" @click="switchToConnect()"
          >Se connecter</span
        >
      </p>
      <div v-if="mode == 'create'" class="form-row">
        <input
          v-model="lastname"
          type="text"
          placeholder="votre nom"
          class="form-row__input"
        />
        <input
          v-model="firstname"
          type="text"
          placeholder="votre prénom"
          class="form-row__input"
        />
      </div>
      <div class="form-row">
        <input
          v-model="email"
          type="email"
          placeholder="votre email"
          class="form-row__input"
        />
      </div>
      <div class="form-row">
        <input
          v-model="password"
          type="password"
          placeholder="votre mot de passe"
          class="form-row__input"
        />
      </div>
      <div class="form-row">
        <button
          @click="login()"
          class="bouton"
          :class="{ 'bouton--disabled': !validFields }"
          v-if="mode == 'login'"
        >
          <span>Se connecter</span>
        </button>
        <span v-if="mode == 'login'" class="error"> {{ error.error }}</span>
        <button
          @click="signup()"
          class="bouton"
          :class="{ 'bouton--disabled': !validFields }"
          v-else
        >
          <span>S'enregistrer</span>
        </button>
        <span v-if="mode == 'create'" class="error"> {{ error.error }}</span>
      </div>
    </div>
  </main>
  <RouterView />
</template>

<script>
import axios from "axios";

export default {
  name: "Login",
  data() {
    return {
      mode: "login",
      lastname: "",
      firstname: "",
      email: "",
      password: "",
      error: "",
      user: "",
      token: "",
    };
  },
  computed: {
    validFields() {
      if (this.mode == "create") {
        if (
          this.email != "" &&
          this.password != "" &&
          this.lastname != "" &&
          this.firstname != ""
        ) {
          return true;
        } else {
          return false;
        }
      } else {
        if (this.email != "" && this.password != "") {
          return true;
        } else {
          return false;
        }
      }
    },
  },
  methods: {
    switchToInscription() {
      this.mode = "create";
    },
    switchToConnect() {
      this.mode = "login";
    },
    async login() {
      const data = {
        email: this.email,
        password: this.password,
      };
      await axios
        .post("http://localhost:8080/api/users/login", data)
        .then((response) => {
          console.log(response);
          localStorage.setItem("user", response.data.userId);
          localStorage.setItem("token", JSON.stringify(response.data.token));
          this.$router.push("/");
        })
        .catch((error) => {
          this.error = error.response.data;
        });
    },
    async signup() {
      let user = JSON.parse(localStorage.getItem("user"));
      let token = JSON.parse(localStorage.getItem("token"));
      const data = {
        lastname: this.lastname,
        firstname: this.firstname,
        email: this.email,
        password: this.password,
      };
      await axios
        .post("http://localhost:8080/api/users/signup", data)
        .then((response) => {
          localStorage.setItem("user", JSON.stringify(response.data.userId));
          localStorage.setItem("token", JSON.stringify(response.data.token));
          this.$router.push("/");
        })
        .catch((error) => {
          this.error = error.response.data;
        });
    },
  },
};
</script>

<style scoped>
@import url("https://fonts.googleapis.com/css2?family=Poppins:wght@400;500;800&display=swap");
@import "@/assets/base.css";

main {
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
}
.logo {
  width: 250px;
  padding: 0;
  margin-left: 20px;
  margin-bottom: 50px;
  margin-top: 50px;
}
.card {
  max-width: 100%;
  width: 550px;
  background: white;
  border-radius: 16px;
  padding: 32px;
}
h1,
p {
  text-align: center;
}
.card__action {
  color: #2196f3;
  text-decoration: underline;
}
.card__action:hover {
  cursor: pointer;
}
.form-row {
  display: flex;
  margin: 16px 0px;
  gap: 5px;
  flex-wrap: wrap;
}
.form-row__input {
  padding: 8px;
  border: none;
  border-radius: 8px;
  background: #f2f2f2;
  font-weight: 500;
  font-size: 16px;
  flex: 1;
  min-width: 100px;
  color: black;
}
.error {
  color: #fd2c03;
}
</style>

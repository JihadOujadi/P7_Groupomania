<template>
  <div class="card--update">
    <form method="post">
      <div >
        <label for="lastname"> </label>
        <input
          v-model="lastname"
          type="text"
          name="lastname"
          id="lastname"
          placeholder="nom"
          class="form-row__input"
        />
      </div>
      <div>
        <label for="firstname"> </label>
        <input
          v-model="firstname"
          type="text"
          name="firstname"
          id="firstname"
          placeholder="prénom"
          class="form-row__input"
        />
      </div>
      <!-- <label for="email">
        <input
          v-model="email"
          type="email"
          id="email"
          placeholder="email"
          class="form-row__input"
        />
      </label> -->
      <button type="submit" @click.prevent="update()" class="bouton">
        Mettre à jour
      </button>
      <span v-if="error" class="error"> {{ error.error }}</span>
    </form>
  </div>
</template>

<script>
import axios from "axios";

export default {
  name: "UpdateProfil",
  data() {
    return {
      image: "",
      token: "",
    };
  },
  methods: {
     update() {
         let token = localStorage.getItem("token");
         const data = {
             lastname: this.lastname,
             firstname: this.firstname,
         }
      axios
        .put("http://localhost:8080/api/users/update-profile", data, {
          headers: { Authorization: `Bearer ${token}` },
        })
        .then(() => {
            document.location.reload();
        })
        .catch((error) => {
          this.error = error.response.data;
        });
     }
  },
};
</script>

<style scoped>
.card--update {
  display: flex;
  width: 100%;
}
form{
    width: 100%;
}
.bouton {
  width: 100%;
}
.error {
  color: #fd2c03;
}
.form-row__input{
  margin: 3px 0; 
  border: 1px solid #ececec; 
  border-radius: 10px
}
</style>

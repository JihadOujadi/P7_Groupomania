<template>
  <img src="@/assets/groupomania-logo.png" alt="Groupomania" class="logo" />
  <div class="card">
    <h1>Connexion</h1>
    <p>Vous n'êtes pas encore inscrit ? <span>S'inscrire</span></p>
    <!-- <h1>Inscription</h1>
    <p>Vous avez déjà un compte ? <span>Connectez-vous</span></p> -->
    <form method="post">
      <div class="form-row">
        <label for="lastname"></label>
        <input
          type="text"
          placeholder="votre nom"
          id="lastname"
          class="form-row__input"
        />
        <label for="firstname"></label>
        <input
          type="text"
          placeholder="votre prénom"
          id="firstname"
          class="form-row__input"
        />
      </div>
      <div class="form-row">
        <label for="email"></label>
        <input
          type="email"
          placeholder="votre email"
          id="email"
          class="form-row__input"
        />
      </div>
      <div class="form-row">
        <label for="password"></label>
        <input
          type="password"
          placeholder="votre mot de passe"
          id="password"
          class="form-row__input"
        />
      </div>

      <div class="form-row">
        <button class="bouton">
          <span>S'enregistrer</span>
        </button>
      </div>

      <!-- <div class="card--login">
        <div class="form-row">
          <label for="email"></label>
          <input
            type="email"
            placeholder="votre email"
            id="email"
            class="form-row__input"
          />
        </div>
        <div class="form-row">
          <label for="password"></label>
          <input
            type="password"
            placeholder="votre mot de passe"
            id="password"
            class="form-row__input"
          />
        </div>
        <button class="bouton">
          <span>Se Connecter</span>
        </button>
      </div> -->
    </form>
  </div>

  <RouterView />
</template>

<style scoped>
@import url("https://fonts.googleapis.com/css2?family=Poppins:wght@400;500;800&display=swap");
@import "@/assets/base.css";

.logo {
  width: 50%;
  padding: 0;
  margin-left: 120px;
  margin-bottom: 50px;
}
.form-row {
  display: flex;
  margin: 16px;
  flex-wrap: wrap;
  gap: 5px;
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

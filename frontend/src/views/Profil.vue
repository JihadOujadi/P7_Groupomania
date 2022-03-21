<template>
  <main>
    <header>
      <img src="@/assets/groupomania-logo-inline.png" alt="Groupomania" />
      <nav class="navbar">
        <ul class="navbar--list">
          <li class="navbar--list__element">
            <a href="#">Accueil</a>
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
        <div class="card--info__name">
          <p>Nom</p>
          <p>Prénom</p>
          <p>Nombre de posts</p>
          <button class="bouton">Modifier mon profil</button>
          <button class="bouton">Déconnexion</button>
        </div>
      </section>
    <section class="card--post">
   <a href="#" class="card--post__element">
   <img>
   </a>
    </section>
    </div>
  </main>
</template>

<style scoped>
main {
  display: flex;
  flex-direction: column;
  gap: 50px;
}
header {
  display: flex;
  justify-content: space-between;
  padding: 0 50px;
  width: 100%;
}
.navbar {
  display: flex;
  align-items: center;
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
</style>

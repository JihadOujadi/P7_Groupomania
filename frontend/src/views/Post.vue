<template>
  <main>
    <header>
      <img src="@/assets/groupomania-logo-inline.png" alt="Groupomania" />
      <nav class="navbar">
        <ul class="navbar--list">
          <li class="navbar--list__element">
            <a href="#">Profil</a>
            <li class="navbar--list__element">
            <a href="#">Déconnexion</a>
          </li>
          </li>
        </ul>
      </nav>
    </header>
    <div class="home">    
    <section class="card">
      <article>
        <a href="#">
        <h2>Nom du user</h2>
          <p class="content">Contenu du post</p>
          <figure>
            <img src="@/assets/image-test.jpg" />
          </figure>
        </a>
        <div class="card--social">
        <span>Nombre de likes</span>
          <font-awesome-icon icon="thumbs-up" />
        </div>
        <div class="card--comment">
        <p>Nom de l'utilisateur</p>
        <p>Commentaire de l'utilisateur</p>
        </div>
      </article>
    </section>
    </div>
  </main>
</template>

<style scoped>
.card--comment{
    display: flex;
    flex-direction: column;
    gap: 10px;
    margin-top: 20px
}
</style>
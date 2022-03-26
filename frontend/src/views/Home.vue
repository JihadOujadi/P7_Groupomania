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
      <h1>Fil d'actualités</h1>
    <section class="post">
    <div class="post--title">
    <img class="post--userimg" src="@/assets/image-test.jpg">
<h2>Dîtes-nous tout...</h2>
</div>
<label for="post"></label>
        <input
          type="text"
          placeholder="Saissisez votre texte"
          id="post"
          class="form-row__input"
        />
        <button class="bouton">Ajouter une photo</button>
    </section>
    
    <section class="card">
      <article>
        <a href="#">
          <h2 class="card--title">Titre du post</h2>
          <p class="card--title__name">Nom Prénom</p>
          <p class="card--content">Contenu du post</p>
          <figure>
            <img src="@/assets/image-test.jpg" />
          </figure>
        </a>
        <div class="card--social">
        <span>Nombre de likes</span>
          <font-awesome-icon icon="thumbs-up" />
          <span>Nombre de commentaires</span>
          <font-awesome-icon icon="comment" />
        </div>
      </article>
    </section>
    </div>
  </main>
</template>

<style scoped>
main{
  display: flex;
  flex-direction: column;
  align-items: center;
}
.navbar ul{
  display: flex;
  gap: 30px
}
a {
  text-decoration: none;
  color: #000;
  transition: .2s ease-in-out;
}
li a:hover{
  color: #C84B31;
}
li {
  list-style: none;
}
.home{
  display: flex;
  flex-direction: column;
}
.home h1{
  margin-bottom: 100px;
}
article h2{
  margin-bottom: 10px;
}
article .content{
margin-bottom: 20px
}
.post{
  display: flex;
  flex-direction: column;
  border: 2px solid #EFEFEF;
  max-width: 100%;
  background: white;
  border-radius: 16px;
  margin-bottom: 50px;
  padding-top: 10px
}
.bouton{
align-self: center
}
.post--title{
  display: flex;
  justify-content: flex-start;
  gap: 40px;
  margin-left: 15px;
}
.post--userimg{
width: 100px;
clip-path: ellipse(35% 50%);
}
.form-row__input{
  width: 100%;
  padding: 20px;
  border: none;
}
.bouton{
  margin-top: 30px;
  margin-bottom: 5px;
  width: 30%; 
}
.card--title{
  margin-bottom: 0
}
.card--title, .card--title__name{
margin-left: 20px;
}
.card--title__name{
  margin-bottom: 20px;
  color: #525252
}
.card--content{
  margin-left: 20px;
  margin-bottom: 20px
}
.card--social{
  display: flex;
  gap: 10px;
  padding: 15px 20px
}
.card{
  margin-bottom: 25px
}
</style>

<template>
<main>
<header>
      <img src="@/assets/groupomania-logo-inline.png" alt="Groupomania" />
      <nav class="navbar">
        <ul class="navbar--list">
          <li class="navbar--list__element">
            <a href="#">Profil</a>
          </li>
        </ul>
      </nav>
    </header>
  <div class="home">
    <h1>Fil d'actualités</h1>
  </div>
 <section class="card">
 <article>
 <a href="#">
 <h2>Titre du post</h2>
 <p>Contenu du post</p>
 <figure>
 <img>
 </figure>
</a>
<div class="card--social">
<font-awesome-icon icon="fa-solid fa-thumbs-up" />
<i class="fa-thin fa-comment"></i>
</div>
 </article>
 </section>
  </main>
</template>

<style>
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
</style>
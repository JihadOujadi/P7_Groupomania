import { createRouter, createWebHistory } from "vue-router";
import Login from "../views/Login.vue";

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: "/",
      name: "home",
      component: Login,
    },  
    {
      path: "/login",
      name: "login", 
      component: () => import("../views/Login.vue"),
    },
    {
      path: "/profil",
      name: "profil",
      component: () => import("../views/Profil.vue"),
    },
  ],
});

export default router;

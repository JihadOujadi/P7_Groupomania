import { createRouter, createWebHistory } from "vue-router";
import Home from "../views/Home.vue";

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: "/",
      name: "home",
      component: Home,
      meta: { requiresAuth: true }
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
    {
      path: "/post/:id",
      name: "post",
      component: () => import("../views/Post.vue"),
    },
  ],
});
router.beforeEach((to, from) => {
  // instead of having to check every route record with
  // to.matched.some(record => record.meta.requiresAuth)
  if (to.meta.requiresAuth && localStorage.getItem("token") === null) {
    // this route requires auth, check if logged in
    // if not, redirect to login page.
    return {
      path: '/login',
      // save the location we were at to come back later
      query: { redirect: to.fullPath },
    }
  }
})

export default router;

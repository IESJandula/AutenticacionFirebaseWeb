import { createRouter, createWebHistory } from "vue-router";
import Login from "./views/Login.vue";
import Admin from "./views/Admin.vue";
import User from "./views/User.vue";

const routes = [
  { path: "/", name: "Login", component: Login },
  { path: "/admin", name: "Admin", component: Admin },
  { path: "/user", name: "User", component: User },
];

export default createRouter({
  history: createWebHistory(),
  routes,
});

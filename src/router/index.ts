import { createRouter, createWebHistory } from "vue-router";

import Chatbox from "../components/Chatbox.vue";
import Game from "../components/Game.vue";

export default createRouter({
  history: createWebHistory("/"),
  routes: [
    {
      path: "/",
      name: "Home",
      component: Chatbox,
    },
    {
      path: "/game/:game",
      name : "Game",
      component : Game,
      props : true,
    },
  ]
});

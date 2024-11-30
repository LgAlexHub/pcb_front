import { createRouter, createWebHistory } from "vue-router";

import Lobby from "../components/Lobby.vue";
import Game from "../components/Game.vue";

export default createRouter({
  history: createWebHistory("/"),
  routes: [
    {
      path: "/",
      name: "Home",
      component: Lobby,
    },
    {
      path: "/game/:game",
      name : "Game",
      component : Game,
      props : true,
    },
  ]
});

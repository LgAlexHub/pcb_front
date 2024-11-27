import { createApp } from 'vue'
import router from  './router/index.ts';

import './index.css'
import { RouterView } from "vue-router";

createApp(RouterView)
    .use(router)
    .mount('#app')


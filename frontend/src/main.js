import { createApp } from "vue";
import { FontAwesomeIcon } from '@fortawesome/vue-fontawesome';
import App from "./App.vue";
import router from "./router";
import { library } from '@fortawesome/fontawesome-svg-core';
import { fas } from '@fortawesome/free-solid-svg-icons';
import store from "./store";

const app = createApp(App);

library.add(fas);

app.use(router);

app.use(store);

app.component('font-awesome-icon', FontAwesomeIcon);

app.mount("#app");

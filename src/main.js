import { createApp } from "vue";
import "./style.css";
import App from "./App.vue";
import router from "./router/index";
import pinia from "./store";
import "@fortawesome/fontawesome-free/css/all.css";

const app = createApp(App);

app.use(router);
app.use(pinia);

app.mount("#app");

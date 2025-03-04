import { createApp } from "vue";
import { createPinia } from "pinia";
import "@/style.css";
import App from "@/App.vue";
import router from "@/router/index";
import "@fortawesome/fontawesome-free/css/all.css";
import { useAuthStore } from "@/stores/auth";
import { createHead } from "@vueuse/head";

const app = createApp(App);
const pinia = createPinia();

app.use(router);
app.use(pinia);
app.use(createHead());

const authStore = useAuthStore(pinia);

authStore
  .init()
  .then(() => {
    app.mount("#app");
  })
  .catch((error) => {
    console.error("Failed to initialize auth:", error);
    app.mount("#app");
  });

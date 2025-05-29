import { createApp } from "vue";
import { createPinia } from "pinia";
import "@/style.css";
import App from "@/App.vue";
import router from "@/router/index";
import "@fortawesome/fontawesome-free/css/all.css";
import { useAuthStore } from "@/stores/authStore";
import { createHead } from "@vueuse/head";
import i18n from "@/i18n";

const app = createApp(App);
const pinia = createPinia();

app.use(router);
app.use(pinia);
app.use(createHead());
app.use(i18n);

const authStore = useAuthStore(pinia);

authStore
  .initAuth()
  .then(() => {
    app.mount("#app");
  })
  .catch((error) => {
    console.error("Failed to initialize auth:", error);
    app.mount("#app");
  });

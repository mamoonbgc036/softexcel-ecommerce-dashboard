import { createApp, h } from "vue";
import { createPinia } from 'pinia'
import { createInertiaApp } from "@inertiajs/vue3";
import axiosInstance from "./services/axiosInstance";
import "@steveyuowo/vue-hot-toast/vue-hot-toast.css"; // Import toast styles

createInertiaApp({
  resolve: (name) => {
    // Dynamically import Vue components/pages
    const pages = import.meta.glob("./Pages/**/*.vue", { eager: true });
    return pages[`./Pages/${name}.vue`];
  },
  title: title => title ? `${title}` : " ",
  setup({ el, App, props, plugin }) {
    const app = createApp({ render: () => h(App, props) });

    const pinia = createPinia();

    // Register Inertia.js and Ziggy plugins
    app.use(plugin);
    app.use(pinia);

    // Make Axios instance globally available
    app.config.globalProperties.$axios = axiosInstance;
    app.provide("$axios", axiosInstance);

    // Mount the Vue app
    app.mount(el);
  },
  progress: {
    color: "var(--color-secondary)", // Customize progress bar color
    showSpinner: true, // Show a spinner while loading
  },
});

import { createInertiaApp } from '@inertiajs/vue3'
import createServer from '@inertiajs/vue3/server'
import { renderToString } from '@vue/server-renderer'
import { createSSRApp, h } from 'vue'
import { createPinia } from 'pinia'
import axiosInstance from "./services/axiosInstance"
import "@steveyuowo/vue-hot-toast/vue-hot-toast.css"

createServer(page =>
  createInertiaApp({
    page,
    render: renderToString,
    resolve: name => {
      const pages = import.meta.glob('./Pages/**/*.vue', { eager: true })
      return pages[`./Pages/${name}.vue`]
    },
    title: title => title ? `${title} - ${import.meta.env.VITE_APP_NAME}` : import.meta.env.VITE_APP_NAME,
    setup({ App, props, plugin }) {
      const app = createSSRApp({
        render: () => h(App, props),
      })

      const pinia = createPinia()

      // Register plugins
      app.use(plugin)
      app.use(pinia)

      // Make Axios instance globally available
      app.config.globalProperties.$axios = axiosInstance
      app.provide("$axios", axiosInstance)

      return app
    },
  }),
)
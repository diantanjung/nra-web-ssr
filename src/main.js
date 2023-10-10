import { createSSRApp } from "vue";
import { createPinia } from "pinia";
import Toast from "vue-toastification";
// Import the CSS or use your own!
import "vue-toastification/dist/index.css";
import App from "./App.vue";

// You can use the following starter router instead of the default one as a clean starting point
// import router from "./router/starter";
import router from "./router";

// Template components
import BaseBlock from "@/components/BaseBlock.vue";
import BaseBackground from "@/components/BaseBackground.vue";
import BasePageHeading from "@/components/BasePageHeading.vue";

// Template directives
import clickRipple from "@/directives/clickRipple";

// Bootstrap framework
// import * as bootstrap from "bootstrap";
// window.bootstrap = bootstrap;

export function createApp() {
    const app = createSSRApp(App)
    // Register global components
    app.component("BaseBlock", BaseBlock);
    app.component("BaseBackground", BaseBackground);
    app.component("BasePageHeading", BasePageHeading);

    // Register global directives
    app.directive("click-ripple", clickRipple);

    // Use Pinia and Vue Router
    app.use(createPinia());
    app.use(router);
    app.use(Toast);
    return { app, router }
  }

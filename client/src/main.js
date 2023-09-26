import { createApp } from 'vue'
import './style.css'
import App from './App.vue'
import { createPinia } from 'pinia'
import { createVuestic } from "vuestic-ui";
import "vuestic-ui/css";
import 'bulma/css/bulma.css'

const app = createApp(App);
const vuestic = createVuestic();
const pinia = createPinia();

app.use(vuestic);
app.use(pinia);

app.mount("#app");
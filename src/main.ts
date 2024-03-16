import { createApp } from "vue";
import "./style.css";
import App from "./App.vue";
import * as VueRouter from "vue-router";

const routes = [
  {
    path: "/",
    redirect: "/json2table",
  },
  {
    name:"json2table",
    path: "/json2table",
    component: ()=>import("./components/JsonTable.vue"),
  },
  {
    name:"jsonConvertor",
    path: "/jsonConvertor",
    component: ()=>import("./components/JsonConvertor.vue"),
  },
];
const router = VueRouter.createRouter({
  history: VueRouter.createWebHashHistory("/json-friends/"),
  routes,
});

const app = createApp(App);
app.use(router);
app.mount("#app");

import {createRouter, createWebHashHistory, RouteRecordRaw} from "vue-router";
import IndexPage from "../pages/IndexPage.vue";
import AdminPage from "../pages/AdminPage.vue";
import hotTopics from "../pages/TotTopics.vue";
import Science from "../pages/Science.vue";
import WriterPage from "../pages/WriterPage.vue";

const routes: Array<RouteRecordRaw> = [
    {
        path: "/",
        component: IndexPage,
    },
    {
        path: "/hotTopics",
        component: hotTopics,
        name: "hotTopics",
    },
    {
        path: "/science",
        component: Science,
        name: "science",
    },
    {
      path: "/writer",
      component: WriterPage,
      name: "writer",
    },
    {
        path: "/admin",
        component: AdminPage,
    },

];

const router = createRouter({
    history: createWebHashHistory(),
    routes,
});

export default router;

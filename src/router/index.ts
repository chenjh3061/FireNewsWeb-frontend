import {createRouter, createWebHashHistory, RouteRecordRaw} from "vue-router";
import IndexPage from "../pages/IndexPage.vue";
import AdminPage from "../pages/AdminPage.vue";
import hotTopics from "../pages/HotTopics.vue";
import Science from "../pages/Science.vue";
import WriterPage from "../pages/Writer/WriterPage.vue";
import ArticlesPage from "../pages/Writer/ArticlesPage.vue";
import UploadPage from "../pages/Writer/UploadPage.vue";
import DashBoard from "../pages/Admin/DashBoard.vue";
import NewsManage from "../pages/Admin/NewsManage.vue";
import UserManage from "../pages/Admin/UserManage.vue";
import NotionManage from "../pages/Admin/NotionManage.vue";
import CategoriesPage from "../pages/Admin/CategoriesPage.vue";
import CarouselPage from "../pages/Admin/CarouselPage.vue";

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
        children: [
            {
                path: "articles",
                name: "articles",
                component: ArticlesPage,
            },
            {
                path: "upload",
                name: "upload",
                component: UploadPage,
            },
        ]
    },
    {
        path: "/admin",
        name: "admin",
        component: AdminPage,
        children: [
            {
                path: "dashboard",
                name: "dashboard",
                component: DashBoard,
            },
            {
                path: "categories",
                name: "categories",
                component: CategoriesPage,
            },
            {
                path: "carousel",
                name: "carousel",
                component: CarouselPage,
            },
            {
                path: "newsManage",
                name: "newsManage",
                component: NewsManage,
            },
            {
                path: "userManage",
                name: "userManage",
                component: UserManage,
            },
            {
                path: "notionManage",
                name: "notionManage",
                component: NotionManage,
            }
        ]
    },

];

const router = createRouter({
    history: createWebHashHistory(),
    routes,
});

export default router;

import {createRouter, createWebHashHistory, RouteRecordRaw} from "vue-router";
import IndexPage from "../pages/IndexPage.vue";
import AdminPage from "../pages/Admin/AdminPage.vue";
import hotTopics from "../pages/HotTopics.vue";
import Science from "../pages/SciencePage.vue";
import WriterPage from "../pages/Writer/WriterPage.vue";
import ArticlesPage from "../pages/Writer/ArticlesPage.vue";
import UploadPage from "../pages/Writer/UploadPage.vue";
import DashBoard from "../pages/Admin/DashBoard.vue";
import NewsManage from "../pages/Admin/NewsManage.vue";
import UserManage from "../pages/Admin/UserManage.vue";
import NotionManage from "../pages/Admin/NotionManage.vue";
import CategoriesPage from "../pages/Admin/CategoriesPage.vue";
import CarouselPage from "../pages/Admin/CarouselPage.vue";
import AboutPage from "../pages/AboutPage.vue";
import CommentManage from "../pages/Admin/CommentManage.vue";
import ErrorPage from "../pages/ErrorPage.vue";
import UserPage from "../pages/UserPage.vue";
import ArticleDetails from "../pages/ArticleDetails.vue";
import SearchPage from "../pages/SearchPage.vue";
import ArticleEditPage from "../pages/ArticleEditPage.vue";

const routes: Array<RouteRecordRaw> = [
    {
        path: "/",
        component: IndexPage,
        meta: {
            title: "首页",
        }
    },
    {
        path: "/hotTopics",
        component: hotTopics,
        name: "hotTopics",
        meta: {
            title: "热门要闻",
        }
    },
    {
        path: "/science",
        component: Science,
        name: "science",
        meta: {
            title: "科普园地",
        }
    },
    {
        path: "/search",
        name: "search",
        component: SearchPage,
    },
    {
        path: '/article',  // 动态路由参数，用来获取新闻 ID
        name: 'ArticleDetail',
        component: ArticleDetails,
        props: true, // 将路由参数作为组件的 props 传递
    },
    {
        path: '/articleEditor',  // 动态路由参数，用来获取新闻 ID
        name: 'ArticleEditor',
        component: ArticleEditPage,
        props: true, // 将路由参数作为组件的 props 传递
    },
    {
        path: "/user",
        name: "user",
        component: UserPage,
        meta: {
            title: "个人中心",
        }
    },
    {
        path: "/about",
        name: "about",
        component: AboutPage,
        meta: {
            title: "关于我们",
        }
    },
    {
        path: "/writer",
        component: WriterPage,
        name: "writer",
        meta: {
            title: "作者页面",
        },
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
        meta: {
            title: "管理员页面",
        },
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
                path: "commentManage",
                name: "commentManage",
                component: CommentManage,
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
    {
        path: "/error",
        name: "error",
        component: ErrorPage,
    },

];

const router = createRouter({
    history: createWebHashHistory(),
    routes,
});

//全局路由守卫
router.beforeEach((to, from, next) => {

    next();
});
export default router;

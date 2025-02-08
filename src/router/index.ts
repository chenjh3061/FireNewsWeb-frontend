import {createRouter, createWebHashHistory, RouteRecordRaw} from "vue-router";
import ACCESS_ENUM from "../access/ACCESS_ENUM.js";
import IndexPage from "../pages/Front/IndexPage.vue";
import AdminPage from "../pages/Admin/AdminPage.vue";
import hotTopics from "../pages/Front/HotTopics.vue";
import Science from "../pages/Front/SciencePage.vue";
import WriterPage from "../pages/Writer/WriterPage.vue";
import ArticlesPage from "../pages/Writer/ArticlesPage.vue";
import UploadPage from "../pages/Writer/UploadPage.vue";
import DashBoard from "../pages/Admin/DashBoard.vue";
import NewsManage from "../pages/Admin/ArticleManage/NewsManage.vue";
import UserManage from "../pages/Admin/UserManage.vue";
import NotionManage from "../pages/Admin/NotionManage.vue";
import CategoriesPage from "../pages/Admin/ArticleManage/CategoriesPage.vue";
import CarouselPage from "../pages/Admin/ArticleManage/CarouselPage.vue";
import AboutPage from "../pages/Front/AboutPage.vue";
import CommentManage from "../pages/Admin/CommentManage.vue";
import ErrorPage from "../pages/ErrorPage.vue";
import UserPage from "../pages/UserPage.vue";
import ArticleDetails from "../pages/ArticleDetails.vue";
import SearchPage from "../pages/Front/SearchPage.vue";
import ArticleEditPage from "../pages/ArticleEditPage.vue";
import ReviewPage from "../pages/Admin/ArticleManage/ReviewPage.vue";
import {useErrorStore, useUserStore} from "../store";
import myAxios from "../plugins/myAxios";
import checkAccess from "../access/checkAccess";
import {message} from "ant-design-vue";
import FileManage from "../pages/Admin/DataCenter/FileManage.vue";
import LogManage from "../pages/Admin/DataCenter/LogManage.vue";

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
        meta: {
            access: ACCESS_ENUM.ADMIN || ACCESS_ENUM.WRITER,
        }
    },
    {
        path: "/user",
        name: "user",
        component: UserPage,
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
            access: ACCESS_ENUM.WRITER || ACCESS_ENUM.ADMIN,
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
            access: ACCESS_ENUM.ADMIN,
            access_redirect: "/error",
        },
        children: [
            {
                path: "dashboard",
                name: "dashboard",
                component: DashBoard,
            },
            {
                path: "fileManage",
                name: "fileManage",
                component: FileManage,
            },
            {
                path: "logManage",
                name: "logManage",
                component: LogManage,
            },
            {
                path: "review",
                name: "review",
                component: ReviewPage,
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
        name: "errorPage",
        component: ErrorPage,
    },
    {
        path: "/:catchAll(.*)",
        name: "error",
        component: ErrorPage,
        beforeEnter: (to, from, next) => {
            const errorStore = useErrorStore();
            if (to.name === 'admin' || to.name === 'writer') {
                errorStore.setError('403', '用户权限不足');
            } else {
                errorStore.setError('404', '页面不存在');
            }
            next();
        }
    },

];

export const getLoginUser = () => {
    myAxios.get("/user/getLoginUser").then(res => {
        if (res.data.data === null) {
            console.log(res.data.data)
            useUserStore().userInfo = null;
        }

    });
}

const router = createRouter({
    history: createWebHashHistory(),
    routes,
});

//全局路由守卫
router.beforeEach((to, from, next) => {
    const userStore = useUserStore();
    const errorStore = useErrorStore();
    const loginUser = userStore.userInfo; // 获取当前登录用户
    const needAccess: string = <string> to.meta.access || ACCESS_ENUM.NOT_LOGIN; // 获取路由中设置的需要的权限，默认为 NOT_LOGIN

    // 使用 checkAccess 来判断权限
    const hasAccess = checkAccess(loginUser, needAccess);

    if (hasAccess) {
        next(); // 如果有权限，继续路由
    } else {
        if (needAccess === ACCESS_ENUM.NOT_LOGIN) {
            next(); // 未登录的用户可以访问的页面继续跳转
        } else {
            message.error('用户权限不足'); // 提示权限不足
            errorStore.setError('403', '用户权限不足');
            next('/error'); // 跳转到登录页面或其他指定页面
        }
    }
});
export default router;

import {ADMIN_ROUTE, LOGIN_ROUTE, PROJECT_ROUTE, PROJECTS_ROUTE, REGISTRATION_ROUTE} from "./utils/consts.js";
import Auth from "./pages/Auth.jsx";
import Projects from "./pages/Projects.jsx";
import Admin from "./pages/Admin.jsx";
import ProjectPage from "./pages/ProjectPage.jsx";

export const authRoutes = [
    {
        path: ADMIN_ROUTE,
        component: Admin
    }
]

export const publicRoutes = [
    {
        path: PROJECTS_ROUTE,
        component: Projects
    },
    {
        path: LOGIN_ROUTE,
        component: Auth
    },
    {
        path: REGISTRATION_ROUTE,
        component: Auth
    },
    {
        path: PROJECT_ROUTE + '/:id',
        component: ProjectPage
    }
]
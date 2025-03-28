import {
    ADMIN_ROUTE,
    CREATE_CONTEST_ROUTE,
    LOGIN_ROUTE,
    PROJECT_ROUTE,
    PROJECTS_ROUTE,
    REGISTRATION_ROUTE
} from "./utils/consts.js";
import Auth from "./pages/Auth.jsx";
import Projects from "./pages/Projects.jsx";
import Admin from "./pages/Admin.jsx";
import ProjectPage from "./pages/ProjectPage.jsx";
import CreateContest from "./pages/CreateContest.jsx";

export const authRoutes = [
    {
        path: ADMIN_ROUTE,
        element: <Admin />
    },
    {
        path: CREATE_CONTEST_ROUTE,
        element: <CreateContest />
    }
]

export const publicRoutes = [
    {
        path: PROJECTS_ROUTE,
        element: <Projects />
    },
    {
        path: LOGIN_ROUTE,
        element: <Auth />
    },
    {
        path: REGISTRATION_ROUTE,
        element: <Auth />
    },
    {
        path: PROJECT_ROUTE + '/:id',
        element: <ProjectPage />
    }
]

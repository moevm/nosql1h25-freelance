import {
    ADMIN_ROUTE,
    CREATE_CONTEST_ROUTE,
    LOGIN_ROUTE,
    CONTEST_ROUTE,
    CONTESTS_ROUTE,
    REGISTRATION_ROUTE
} from "./utils/consts.js";
import Auth from "./pages/Auth.jsx";
import Contests from "./pages/Contests.jsx";
import Admin from "./pages/Admin.jsx";
import ContestPage from "./pages/ContestPage.jsx";
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
        path: CONTESTS_ROUTE,
        element: <Contests />
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
        path: CONTEST_ROUTE + '/:id',
        element: <ContestPage />
    }
]

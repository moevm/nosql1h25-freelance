import {
    ADMIN_ROUTE,
    CREATE_CONTEST_ROUTE,
    LOGIN_ROUTE,
    CONTEST_ROUTE,
    CONTESTS_ROUTE,
    REGISTRATION_ROUTE,
    MY_SOLUTIONS_ROUTE,
    MY_CONTESTS_ROUTE,
    CREATE_SOLUTION_ROUTE
} from "./utils/consts.js";
import Auth from "./pages/Auth.jsx";
import Contests from "./pages/Contests.jsx";
import Admin from "./pages/Admin.jsx";
import ContestPage from "./pages/ContestPage.jsx";
import CreateContest from "./pages/CreateContest.jsx";
import CreateSolution from "./pages/CreateSolution.jsx";
import MyContests from "./pages/MyContests.jsx";
import MySolutions from "./pages/MySolutions.jsx";

export const authRoutes = [
    {
        path: ADMIN_ROUTE,
        element: <Admin />
    },
    {
        path: CREATE_CONTEST_ROUTE,
        element: <CreateContest />
    },
    {
        path: MY_SOLUTIONS_ROUTE,
        element: <MySolutions />
    },
    {
        path: CONTEST_ROUTE + '/:number' + CREATE_SOLUTION_ROUTE,
        element: <CreateSolution />
    },
    {
        path: MY_CONTESTS_ROUTE,
        element: <MyContests />
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
        path: CONTEST_ROUTE + '/:number',
        element: <ContestPage />
    }
]

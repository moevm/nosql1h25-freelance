import React, {useContext} from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import { authRoutes, publicRoutes } from "../routes.jsx";
import {PROJECTS_ROUTE} from "../utils/consts.js";
import {Context} from "../main.jsx";

const AppRouter = () => {
    const {user} = useContext(Context)

    console.log(user)
    return (
        <Routes>
            {user.isAuth && authRoutes.map(({ path, element }) =>
                <Route key={path} path={path} element={element} exact />
            )}
            {publicRoutes.map(({ path, element }) =>
                <Route key={path} path={path} element={element} exact />
            )}
            {/*перенаправление по умолчанию*/}
            <Route path="*" element={<Navigate to={PROJECTS_ROUTE} />} />
        </Routes>
    );
};

export default AppRouter;

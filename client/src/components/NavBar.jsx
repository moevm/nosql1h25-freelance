import React, { useContext } from 'react';
import { Context } from "../main.jsx";
import { NavLink, useNavigate } from "react-router-dom";
import { CONTESTS_ROUTE, ADMIN_ROUTE, LOGIN_ROUTE, MY_SOLUTIONS_ROUTE, MY_CONTESTS_ROUTE, CREATE_CONTEST_ROUTE } from "../utils/consts.js";
import { Navbar, Nav, Container, Button } from 'react-bootstrap';
import { observer } from "mobx-react-lite";
import logo from '../../assets/logo.svg';

const NavBar = () => {
    const { user } = useContext(Context);
    const navigate = useNavigate();

    const logOut = () => {
        user.setUser({});
        user.setIsAuth(false);
        navigate(CONTESTS_ROUTE); // или просто "/"
    };

    return (
        <Navbar variant="dark" expand="lg" className="mb-4" style={{ backgroundColor: '#543787' }}>
            <Container>
                <Navbar.Brand as={NavLink} to={CONTESTS_ROUTE}>
                    <div className="d-flex align-items-center">
                        <img
                            src={logo}
                            alt="Logo"
                            style={{ height: '30px', marginRight: '10px' }}
                        />
                        DevContest
                    </div>
                </Navbar.Brand>
                <Navbar.Toggle aria-controls="basic-navbar-nav" />
                <Navbar.Collapse id="basic-navbar-nav">
                    <Nav className="ms-auto">
                        {user.isAuth ? (
                            <>
                                {/* Если пользователь Фрилансер (role: 1) */}
                                {user.user && user.user.role === 1 && (
                                    <Button
                                        variant="outline-light"
                                        className="me-2"
                                        onClick={() => navigate(MY_SOLUTIONS_ROUTE)}
                                    >
                                        Мои решения
                                    </Button>
                                )}
                                {/* Если пользователь Организатор (role: 2) */}
                                {user.user && user.user.role === 2 && (
                                    <>
                                        <Button
                                            variant="outline-light"
                                            className="me-2"
                                            onClick={() => navigate(MY_CONTESTS_ROUTE)}
                                        >
                                            Мои конкурсы
                                        </Button>
                                        <Button
                                            variant="outline-light"
                                            className="me-2"
                                            onClick={() => navigate(CREATE_CONTEST_ROUTE)}
                                        >
                                            Добавить конкурс
                                        </Button>
                                    </>
                                )}
                                <Button variant="outline-light" onClick={logOut}>
                                    Выйти
                                </Button>
                            </>
                        ) : (
                            <Button
                                variant="outline-light"
                                onClick={() => navigate(LOGIN_ROUTE)}
                            >
                                Войти
                            </Button>
                        )}
                    </Nav>
                </Navbar.Collapse>
            </Container>
        </Navbar>
    );
};

export default observer(NavBar);
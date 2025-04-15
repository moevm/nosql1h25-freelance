import React, { useContext } from 'react';
import { Context } from "../main.jsx";
import { NavLink, useNavigate } from "react-router-dom";
import { CONTESTS_ROUTE, ADMIN_ROUTE, LOGIN_ROUTE } from "../utils/consts.js";
import { Navbar, Nav, Container, Button } from 'react-bootstrap';
import { observer } from "mobx-react-lite";

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
                <Navbar.Brand as={NavLink} to={CONTESTS_ROUTE}>DevContest</Navbar.Brand>
                <Navbar.Toggle aria-controls="basic-navbar-nav" />
                <Navbar.Collapse id="basic-navbar-nav">
                    <Nav className="ms-auto">
                        {user.isAuth ? (
                            <>
                                <Nav.Link as={NavLink} to={ADMIN_ROUTE}>Админ-панель</Nav.Link>
                                <Button
                                    variant="outline-light"
                                    onClick={logOut}
                                    className="ms-2"
                                >
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
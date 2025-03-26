import React, { useContext } from 'react';
import { Context } from "../main.jsx";
import { NavLink } from "react-router-dom";
import { PROJECTS_ROUTE, ADMIN_ROUTE } from "../utils/consts.js";
import { Navbar, Nav, Container, Button } from 'react-bootstrap';
import { observer } from "mobx-react-lite";

const NavBar = () => {
    const { user } = useContext(Context);

    return (
        <Navbar bg="dark" variant="dark" expand="lg" className="mb-4">
            <Container>
                <Navbar.Brand as={NavLink} to={PROJECTS_ROUTE}>DevContest</Navbar.Brand>
                <Navbar.Toggle aria-controls="basic-navbar-nav" />
                <Navbar.Collapse id="basic-navbar-nav">
                    <Nav className="ms-auto">
                        {user.isAuth ? (
                            <>
                                <Nav.Link as={NavLink} to={ADMIN_ROUTE}>Админ-панель</Nav.Link>
                                <Button
                                    variant="outline-light"
                                    onClick={() => user.setIsAuth(false)}
                                >
                                    Выйти
                                </Button>
                            </>
                        ) : (
                            <Button
                                variant="outline-light"
                                onClick={() => user.setIsAuth(true)}
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
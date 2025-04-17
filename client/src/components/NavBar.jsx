import React, { useContext } from 'react';
import { Context } from "../main.jsx";
import { NavLink } from "react-router-dom";
import { CONTESTS_ROUTE, ADMIN_ROUTE } from "../utils/consts.js";
import { Navbar, Nav, Container, Button } from 'react-bootstrap';
import { observer } from "mobx-react-lite";
import logo from '../../assets/logo.svg';

const NavBar = () => {
    const { user } = useContext(Context);

    return (
        <Navbar
            variant="dark"
            expand="lg"
            className="mb-4"
            style={{
                background: 'linear-gradient(90deg, #BA38FE 0%, #4EC1FF 100%)'
            }}
        >
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
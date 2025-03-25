import React from 'react';
import {Card, Container, Form, Row} from 'react-bootstrap';
import {NavLink, useLocation} from "react-router-dom";
import {LOGIN_ROUTE, REGISTRATION_ROUTE} from "../utils/consts.js";


const Auth = () => {
    const location = useLocation();
    const isLogin = location.pathname === LOGIN_ROUTE;

    return (
        <Container>
            <Card>
                <h2>{isLogin ? 'Авторизация' : 'Регистрация'}</h2>
                <Form>
                    <Form.Control
                        placeholder="login"
                    />
                    <Form.Control
                        placeholder="password"
                    />
                </Form>
                <Row>
                    {isLogin ?
                        <NavLink to={REGISTRATION_ROUTE}>Регистрация</NavLink>
                        :
                        <NavLink to={LOGIN_ROUTE}>Авторизация</NavLink>
                    }
                    <button>
                        {isLogin ? 'Войти' : 'Зарегистрироваться'}
                    </button>
                </Row>
            </Card>
        </Container>
    );
};

export default Auth;
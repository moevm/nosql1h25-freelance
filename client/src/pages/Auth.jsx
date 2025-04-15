import React, { useState, useContext } from 'react';
import {Card, Container, Form, Row, Button, Alert} from 'react-bootstrap';
import {NavLink, useLocation, useNavigate} from "react-router-dom";
import {LOGIN_ROUTE, REGISTRATION_ROUTE} from "../utils/consts.js";
import { sendData } from "../services/apiService.js";
import { Context } from "../main.jsx";
import { observer } from "mobx-react-lite";

const Auth = () => {
    const location = useLocation();
    const navigate = useNavigate();
    const isLogin = location.pathname === LOGIN_ROUTE;
    const { user } = useContext(Context);

    const [loginInput, setLoginInput] = useState('');
    const [passwordInput, setPasswordInput] = useState('');
    const [error, setError] = useState(null);

    const handleSubmit = async (event) => {
        event.preventDefault();
        setError(null);

        try {
            let endpoint = isLogin ? '/login' : '/users';
            const data = {
                login: loginInput,
                password: passwordInput,
                // Для регистрации можно добавить и другие данные (например, email) по необходимости
            };
            const response = await sendData(endpoint, data);

            // Если это регистрация, можно сразу залогинить пользователя или перенаправить на страницу входа
            if (isLogin) {
                // Обновляем состояние пользователя и делаем редирект, если вход успешен
                user.setUser(response.user);
                user.setIsAuth(true);
                navigate('/');
            } else {
                // После успешной регистрации можно перенаправить на страницу входа
                navigate(LOGIN_ROUTE);
            }
        } catch (err) {
            // При ошибках можно показать сообщение
            setError(err.response?.data?.message || "Что-то пошло не так");
        }
    };

    return (
        <Container style={{ maxWidth: '400px', marginTop: '50px' }}>
            <Card className="p-4">
                <h2 className="mb-4">{isLogin ? 'Авторизация' : 'Регистрация'}</h2>
                {error && <Alert variant="danger">{error}</Alert>}
                <Form onSubmit={handleSubmit}>
                    <Form.Group controlId="formBasicLogin" className="mb-3">
                        <Form.Control
                            type="text"
                            placeholder="Логин"
                            value={loginInput}
                            onChange={(e) => setLoginInput(e.target.value)}
                            required
                        />
                    </Form.Group>
                    <Form.Group controlId="formBasicPassword" className="mb-3">
                        <Form.Control
                            type="password"
                            placeholder="Пароль"
                            value={passwordInput}
                            onChange={(e) => setPasswordInput(e.target.value)}
                            required
                        />
                    </Form.Group>
                    <Button variant="primary" type="submit" className="w-100 mb-3">
                        {isLogin ? 'Войти' : 'Зарегистрироваться'}
                    </Button>
                </Form>
                <Row>
                    {isLogin ? (
                        <div>
                            Нет аккаунта? <NavLink to={REGISTRATION_ROUTE}>Зарегистрируйтесь!</NavLink>
                        </div>
                    ) : (
                        <div>
                            Есть аккаунт? <NavLink to={LOGIN_ROUTE}>Войдите!</NavLink>
                        </div>
                    )}
                </Row>
            </Card>
        </Container>
    );
};

export default observer(Auth);
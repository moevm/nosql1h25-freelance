import React, { useState, useContext } from 'react';
import { Container, Form, Button } from 'react-bootstrap';
import { Context } from '../main.jsx';
import { useNavigate } from 'react-router-dom';
import { sendData } from '../services/apiService.js';

const CreateSolution = () => {
    const { user, contest } = useContext(Context);
    const contestId = contest.selectedContest?.id;
    const navigate = useNavigate();

    const [description, setDescription] = useState('');

    const handleSubmit = async () => {
        if (!user.isAuth || !user.user?.id) {
            alert('Для отправки решения необходимо войти в систему');
            navigate('/login');
            return;
        }

        if (!description.trim()) {
            alert('Пожалуйста, добавьте описание решения');
            return;
        }

        const data = {
            freelancerId: user.user.id,
            description,
            contestId
        };

        try {
            await sendData(`/contests/${contestId}/solutions`, data);
            alert("Решение успешно добавлено!");
            navigate(`/contests/${contestId}`);
        } catch (error) {
            console.error("Ошибка при отправке решения:", error);
            alert("Произошла ошибка при добавлении решения");
        }
    };

    return (
        <Container className="mt-4">
            <h1 className="mb-4">Прикрепить решение</h1>

            <Form>
                <Form.Group className="mb-3">
                    <Form.Label>Описание (Markdown поддерживается)</Form.Label>
                    <Form.Control
                        as="textarea"
                        rows={10}
                        placeholder="Опишите ваше решение"
                        value={description}
                        onChange={e => setDescription(e.target.value)}
                    />
                </Form.Group>
                <Button variant="primary" className="me-2" onClick={handleSubmit}>
                    Отправить
                </Button>
            </Form>
        </Container>
    );
};

export default CreateSolution;

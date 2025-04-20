import React, { useContext, useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Container, Card, Button, Spinner, Alert } from 'react-bootstrap';
import { observer } from 'mobx-react-lite';
import { Context } from '../main.jsx';
import { fetchData } from '../services/apiService.js';

const ReviewPage = () => {
    const { number, reviewNumber } = useParams();
    const navigate = useNavigate();
    const { solution, user } = useContext(Context);

    const [review, setReview]   = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError]     = useState(null);

    useEffect(() => {
        (async () => {
            try {
                // 1) Получаем решение (без reviews)
                const sol = solution.getSolutionIfExists(number)
                    || await solution.fetchSolutionByNumber(number);
                if (!sol) throw new Error('Решение не найдено');

                // 2) Проверяем права
                const isOwner    = user.user?.id === sol.freelancerId;
                const isEmployer = user.user?.role === 2;
                if (!user.isAuth || (!isOwner && !isEmployer)) {
                    throw new Error('Доступ запрещён');
                }

                // 3) Явно подгружаем массив reviews
                const list = await fetchData(`/solutions/${sol.id}/reviews`);
                const rv   = list.find(r => String(r.number) === reviewNumber);
                if (!rv) throw new Error('Отзыв не найден');

                setReview(rv);
            } catch (err) {
                console.error(err);
                setError(err.message);
            } finally {
                setLoading(false);
            }
        })();
    }, [number, reviewNumber, user.user, user.isAuth, solution]);

    if (loading) {
        return (
            <Container className="mt-4 text-center">
                <Spinner animation="border" /><p>Загрузка отзыва…</p>
            </Container>
        );
    }
    if (error) {
        return (
            <Container className="mt-4">
                <Alert variant="danger">{error}</Alert>
                <Button onClick={() => navigate(-1)}>Назад</Button>
            </Container>
        );
    }

    return (
        <Container className="mt-4">
            <Card className="shadow-sm">
                <Card.Header>
                    <h3>Отзыв #{review.number} к решению №{number}</h3>
                </Card.Header>
                <Card.Body>
                    <p><strong>Оценка:</strong> {review.score}</p>
                    <hr />
                    <p>{review.commentary}</p>
                </Card.Body>
                <Card.Footer>
                    <Button variant="secondary" onClick={() => navigate(-1)}>Назад</Button>
                </Card.Footer>
            </Card>
        </Container>
    );
};

export default observer(ReviewPage);

import React from 'react';
import { Card, Badge } from 'react-bootstrap';

const ContestPage = () => {
    const contest = {
        title: 'Дизайн логотипа для стартапа',
        type: 'Дизайн',
        prize: '5000',
        deadline: '15 марта 2025',
        status: 'Открыт',
        description: 'Создай уникальный логотип для нового IT-стартапа. Требуется минимализм и современный стиль.',
        requirements: [
            'Формат: PNG или SVG',
            'Цвета: Не более трёх',
            'Срок: До 15 марта 2025'
        ]
    };

    return (
        <Card className="mb-4 shadow-sm">
            <Card.Body>
                <Card.Title className="mb-3">
                    {contest.title}
                    <Badge bg="secondary" className="ms-2">
                        {contest.type}
                    </Badge>
                </Card.Title>

                <div className="d-flex justify-content-between mb-3">
                    <div>
                        <strong>Приз:</strong> {contest.prize} руб.
                    </div>
                    <div>
                        <strong>Дата окончания:</strong> {contest.deadline}
                    </div>
                    <Badge bg={contest.status === 'Открыт' ? 'success' : 'danger'}>
                        {contest.status}
                    </Badge>
                </div>

                <Card.Subtitle className="mb-2 text-muted">Описание проекта</Card.Subtitle>
                <Card.Text className="mb-4">{contest.description}</Card.Text>

                <Card.Subtitle className="mb-2">Требования:</Card.Subtitle>
                <ul className="list-unstyled">
                    {contest.requirements.map((req, index) => (
                        <li key={index} className="mb-1">
                            • {req}
                        </li>
                    ))}
                </ul>
            </Card.Body>
        </Card>
    );
};

export default ContestPage;
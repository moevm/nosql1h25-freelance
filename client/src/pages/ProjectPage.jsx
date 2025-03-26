import React from 'react';
import { Card, Badge } from 'react-bootstrap';

const ProjectPage = () => {
    const project = {
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
                    {project.title}
                    <Badge bg="secondary" className="ms-2">
                        {project.type}
                    </Badge>
                </Card.Title>

                <div className="d-flex justify-content-between mb-3">
                    <div>
                        <strong>Приз:</strong> {project.prize} руб.
                    </div>
                    <div>
                        <strong>Дата окончания:</strong> {project.deadline}
                    </div>
                    <Badge bg={project.status === 'Открыт' ? 'success' : 'danger'}>
                        {project.status}
                    </Badge>
                </div>

                <Card.Subtitle className="mb-2 text-muted">Описание проекта</Card.Subtitle>
                <Card.Text className="mb-4">{project.description}</Card.Text>

                <Card.Subtitle className="mb-2">Требования:</Card.Subtitle>
                <ul className="list-unstyled">
                    {project.requirements.map((req, index) => (
                        <li key={index} className="mb-1">
                            • {req}
                        </li>
                    ))}
                </ul>
            </Card.Body>
        </Card>
    );
};

export default ProjectPage;
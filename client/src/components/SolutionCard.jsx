import React, { useContext } from 'react';
import { Card, Col, Badge } from "react-bootstrap";
import { useNavigate } from 'react-router-dom';
import { Context } from "../main.jsx";
import { SOLUTION_ROUTE } from "../utils/consts.js";

const SolutionCard = ({ currentSolution, contest, freelancer, showContestTitle  }) => {
    const { solution } = useContext(Context);
    const navigate = useNavigate();

    const status = solution.getStatus(currentSolution.status);
    
    // Форматирование даты
    const formatDate = (dateString) => {
        return new Date(dateString).toLocaleDateString('ru-RU', {
            day: '2-digit',
            month: 'long',
            year: 'numeric',
            hour: '2-digit',
            minute: '2-digit'
        });
    };

    // Определяем, нужно ли писать "Создано" или "Обновлено"
    const isCreated = currentSolution.updatedAt === currentSolution.createdAt;
    const dateLabel = isCreated ? "Создано" : "Обновлено";
    const formattedDate = formatDate(isCreated ? currentSolution.createdAt : currentSolution.updatedAt);

    return (
        <Col md={4} className="mb-3">
            <Card
                border="light"
                className="shadow"
                style={{ height: showContestTitle ? '230px' : '210px', cursor: 'pointer' }} // Адаптируем высоту
                onClick={(e) => {
                    const selection = window.getSelection();
                    if (selection && selection.toString().length > 0) return;
                    navigate(SOLUTION_ROUTE + '/' + currentSolution.number);
                }}
            >
                <Card.Body className="d-flex flex-column">
                    {/* Заголовок решения */}
                    <Card.Title style={{ fontSize: '1.2rem', fontWeight: 'bold', color: '#222' }}>
                        Решение
                    </Card.Title>

                    {/* Описание конкурса (условный рендеринг) */}
                    {showContestTitle && (
                        <div className="mt-1" style={{ fontSize: '0.9rem', color: '#555' }}>
                            Конкурс: {contest?.title || currentSolution.contestId}
                        </div>
                    )}

                    {/* Фрилансер */}
                    <div className="mt-2" style={{ fontSize: '0.9rem' }}>
                        <strong>Фрилансер:</strong> {freelancer?.login || currentSolution.freelancerId}
                    </div>

                    {/* Блок с датой и статусом */}
                    <div className="mt-auto d-flex justify-content-between align-items-end">
                        {/* Дата */}
                        <div style={{ fontSize: '0.8rem', color: '#555' }}>
                            {dateLabel}: {formattedDate}
                        </div>
                        
                        {/* Статус */}
                        <Badge 
                            style={{ 
                                backgroundColor: status.color,
                                color: status.textColor,
                                fontSize: '0.85rem'
                            }}
                        >
                            {status.label}
                        </Badge>
                    </div>
                </Card.Body>
            </Card>
        </Col>
    );
};

export default SolutionCard;

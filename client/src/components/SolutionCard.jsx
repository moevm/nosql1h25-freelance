import React, { useContext } from 'react';
import { Card, Col } from "react-bootstrap";
import { useNavigate } from 'react-router-dom';
import { Context } from "../main.jsx";
import { SOLUTION_ROUTE } from "../utils/consts.js";

const SolutionCard = ({ currentSolution, contest, freelancer, showContestTitle, showFreelancerLogin  }) => {
    const { solution } = useContext(Context);
    const navigate = useNavigate();

    const status = solution.getStatus(currentSolution.status);

    const formatDate = (dateString) => {
        return new Date(dateString).toLocaleDateString('ru-RU', {
            day: '2-digit',
            month: 'long',
            year: 'numeric',
            hour: '2-digit',
            minute: '2-digit'
        });
    };

    const isCreated = currentSolution.updatedAt === currentSolution.createdAt;
    const dateLabel = isCreated ? "Создано" : "Обновлено";
    const formattedDate = formatDate(isCreated ? currentSolution.createdAt : currentSolution.updatedAt);

    return (
        <Col
            xs={12}
            className="my-3"
            onClick={(e) => {
                const selection = window.getSelection();
                if (selection && selection.toString().length > 0) return;

                solution.setCurrentSolution(currentSolution);
                navigate(SOLUTION_ROUTE + '/' + currentSolution.number);
            }}
        >
            <Card
                border="light"
                className="shadow-lg rounded-lg"
                style={{
                    cursor: 'pointer', minHeight: '200px',
                }}
            >
                <Card.Body>
                    {/* Название */}
                    <div className="d-flex justify-content-between align-items-center">
                        <Card.Title className="text-truncate" style={{
                            fontSize: '1.5rem', fontWeight: 'bold', color: '#333',
                        }}>
                            Решение
                        </Card.Title>
                    </div>

                    {/* Название конкурса (условный рендеринг) */}
                    {showContestTitle && (
                        <div style={{height: '80px'}}>
                            <Card.Text className="mt-2" style={{fontSize: '1rem', color: '#555', lineHeight: '1.4'}}>
                                <strong>Конкурс:</strong> {contest?.title || "Неизвестный конкурс"}
                            </Card.Text>
                        </div>
                    )}
                </Card.Body>
                <Card.Body>
                    {/* Фрилансер (условный рендеринг) */}
                    <div className="d-flex justify-content-between align-items-center">
                        <span style={{color: '#543787', fontWeight: '600'}}>
                            {freelancer?.login || "Неизвестный фрилансер"}
                        </span>
                    </div>

                    {/* Статус и дата */}
                    <div className="d-flex justify-content-between align-items-center mt-2">
                        <div className="d-flex align-items-center">
                            <span
                                style={{
                                    fontSize: '0.9rem',
                                    color: status.textColor,
                                    fontWeight: '500',
                                    background: status.color,
                                    padding: '4px 8px',
                                    borderRadius: '8px'
                                }}
                            >
                                {status.label}
                            </span>
                        </div>
                        <span style={{fontSize: '0.9rem', color: '#666'}}>
                            {dateLabel}: {formattedDate}
                        </span>
                    </div>
                </Card.Body>
            </Card>
        </Col>
    );
};

export default SolutionCard;

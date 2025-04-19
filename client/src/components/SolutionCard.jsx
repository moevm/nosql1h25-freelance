import React, { useContext } from 'react';
import { Card, Col, Badge } from "react-bootstrap";
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
        <Col md={4} className="mb-3">
            <Card
                border="light"
                className="shadow"
                style={{ height: showContestTitle ? '230px' : '210px', cursor: 'pointer' }} // Адаптируем высоту
                onClick={(e) => {
                    const selection = window.getSelection();
                    if (selection && selection.toString().length > 0) return;

                    // Сохраняем решение в store перед переходом
                    solution.setCurrentSolution(currentSolution);
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
                            <strong>Конкурс:</strong> {contest?.title || currentSolution.contestId}
                        </div>
                    )}

                    {/* Фрилансер (условный рендеринг) */}
                    {showFreelancerLogin && (
                        <div className="mt-2" style={{ fontSize: '0.9rem' }}>
                            <strong>Фрилансер:</strong> {freelancer?.login || currentSolution.freelancerId}
                        </div>
                    )}

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

    return (<Col
            xs={12}
            className="my-2"
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
                            {item.title}
                        </Card.Title>
                        <div className="d-flex justify-content-between align-items-center">
                            <BsStarFill color="gold" size={22} className="me-1"/>
                            <span style={{fontSize: '1rem', color: '#666'}}>{item.rating || '4.8'}</span>
                        </div>
                    </div>
                    <div className="d-flex justify-content-between align-items-center">
                        <Card.Title className="text-truncate" style={{
                            fontSize: '1.5rem', fontWeight: 'bold', color: '#333',
                        }}>
                            Решение
                        </Card.Title>
                    </div>
                    
                    {/* Описание */}
                    <div style={{height: '80px'}}>
                        <Card.Text className="mt-2" style={{fontSize: '1rem', color: '#555', lineHeight: '1.4'}}>
                            {item.annotation}
                        </Card.Text>
                    </div>
                </Card.Body>
                <Card.Body>
                    {/* Компания и приз */}
                    <div className="d-flex justify-content-between align-items-center">
                            <span style={{color: '#543787', fontWeight: '600'}}>
                                {creator ? creator.login : 'Неизвестный создатель'}
                            </span>
                        <div>
                            <BsTrophy color="green" size={20} className="me-1"/>
                            <span style={{fontSize: '1rem', fontWeight: 'bold', color: 'green'}}>
                                    {item.prizepool} ₽.
                                </span>
                        </div>
                    </div>
                    {/* Индикатор статуса */}
                    <div className="d-flex justify-content-between align-items-center mt-2">
                        <div className="d-flex align-items-center">
                            <span
                                className={`badge ${statusColor} me-2`}
                                style={{fontSize: '0.9rem', fontWeight: '500'}}
                            >
                                {statusText}
                            </span>
    
                            <span
                                style={{
                                    fontSize: '0.9rem',
                                    color: '#543787',
                                    fontWeight: '500',
                                    background: '#f1f1f9',
                                    padding: '4px 8px',
                                    borderRadius: '8px'
                                }}
                            >
                                {contestTypeName}
                            </span>
                        </div>
                        <span style={{fontSize: '0.9rem', color: '#666'}}>
                            {isOpen ? "До" : "C"} {new Date(item.endBy).toLocaleDateString('ru-RU', {
                                day: '2-digit', month: 'long', year: 'numeric'
                            })}
                        </span>
                    </div>
    
                </Card.Body>
            </Card>
        </Col>);
};

export default SolutionCard;

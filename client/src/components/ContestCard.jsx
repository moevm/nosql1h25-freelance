import React, { useContext } from 'react';
import {Card, Col} from "react-bootstrap";
import {useNavigate} from 'react-router-dom';
import { Context } from "../main.jsx";
import { CONTEST_ROUTE } from "../utils/consts.js";
import { BsStar, BsTrophy } from 'react-icons/bs';

const ContestCard = ({ contest: item }) => {
    const { contest } = useContext(Context);
    const navigate = useNavigate();

    //TODO isOpen
    const isOpen = new Date(item.endBy) > new Date();
    const statusText = isOpen ? 'Открыт' : 'Закрыт';
    const statusColor = isOpen ? 'bg-success' : 'bg-danger';

    return (
        <Col
            md={4}
            onClick={(e) => {
                const selection = window.getSelection();
                if (selection && selection.toString().length > 0) return;

                contest.setCurrentContest(item);
                navigate(CONTEST_ROUTE + '/' + item.number);
            }}
        >
            <Card
                border="light"
                className="mt-3 shadow"
                style={{
                    height: '230px',
                }}
            >
                <Card.Body>
                    {/*Название*/}
                    <div className="d-flex justify-content-between align-items-center">
                        <Card.Title className="text-truncate" style={{
                            fontSize: '1.25rem',
                            fontWeight: 'bold',
                            color: 'black'
                        }}>
                            {item.title}
                        </Card.Title>
                        <div className="d-flex justify-content-between align-items-center">
                            <BsStar color="gold" className="me-1"/>
                            <span>{item.rating || '4.8'}</span>
                        </div>
                    </div>
                    {/* Описание */}
                    <div style={{height:'70px'}}>
                        <Card.Text className="mt-2" style={{fontSize: '0.9rem', color: '#333'}}>
                            {item.annotation}
                        </Card.Text>
                    </div>
                </Card.Body>
                <Card.Body>
                    {/* Компания и приз */}
                    <div className="d-flex justify-content-between align-items-center">
                        <span style={{color: '#543787'}}>
                            {/* TODO Отображать создателя */}
                            {'TechSolutions Inc.'}
                        </span>
                        <div>
                            <BsTrophy color="green" className="me-1"/>
                            <span style={{fontSize: '0.9rem', fontWeight: 'bold', color: 'green'}}>
                                {item.prizepool} ₽.
                            </span>
                        </div>
                    </div>
                    {/* Индикатор статуса */}
                    <div className="d-flex justify-content-between align-items-center mt-2">
                        <span
                            className={`badge ${statusColor}`}
                            style={{fontSize: '0.8rem'}}
                        >
                            {statusText}
                        </span>
                        <span>
                             {isOpen? "До" : "C"} {new Date(item.endBy).toLocaleDateString('ru-RU', {
                            day: '2-digit',
                            month: 'long',
                            year: 'numeric'
                        })}
                        </span>
                    </div>
                </Card.Body>
            </Card>
        </Col>
    );
};

export default ContestCard;
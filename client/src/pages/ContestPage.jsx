import React, { useEffect, useContext, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Context } from '../main.jsx';
import { Container, Card, Badge, Button } from 'react-bootstrap';
import { observer } from 'mobx-react-lite';
import Markdown from 'markdown-to-jsx';

const ContestPage = () => {
    const { contest, user } = useContext(Context);
    const { number } = useParams();
    const [ currentContest, setCurrentContest ] = useState(null);
    const [ error, setError ] = useState(null);

    const navigate = useNavigate();

    useEffect(() => {
        if (contest.currentContest && contest.currentContest.number == number) {
            setCurrentContest(contest.currentContest);
        } else {
            const fetchContest = async () => {
                const fetched = await contest.fetchOneContestByNumber(number);
                if (fetched) {
                    setCurrentContest(fetched);
                } else {
                    setError("Конкурс не найден.");
                }
            };
            fetchContest();
        }
    }, [number, contest.currentContest]);

    useEffect(() => {
        contest.fetchTypes();
    }, [])

    if (error) {
        return <div>{error}</div>;
    }

    if (!currentContest) {
        return <div>Загрузка...</div>;
    }

    const isFreelancer = user.user && user.user.role === 1;
    const isEmployer = user.user && user.user.role === 2;

    return (
        <Container>
            <Card className="mb-4 shadow-sm">
                <Card.Header>
                    <Card.Title>
                        <h1>{currentContest.title}</h1>
                    </Card.Title>
                    <h2>
                        <Badge bg="secondary" className="">
                            {contest.getTypeNameById(currentContest.type)}
                        </Badge>
                        <Badge className="ms-2" bg={currentContest.status === 1 ? 'success' : 'danger'}>
                            {contest.getStatus(currentContest.status)}
                        </Badge>
                    </h2>
                    <h4 className="mb-1">Дата окончания: {(new Date(currentContest.endBy)).toLocaleDateString('ru-RU', {})}<span className="ms-3">Приз: {currentContest.prizepool} руб.</span></h4>
                </Card.Header>
                <Card.Body>
                    <Card.Subtitle className="mb-1"><h2>Описание проекта</h2></Card.Subtitle>
                        <Markdown options={{ disableParsingRawHTML: true }}>
                            {currentContest.description}
                        </Markdown>
                </Card.Body>
                {isFreelancer && 
                    <Card.Footer>
                        <Button variant="primary" onClick={() => navigate(`/contest/${currentContest.number}/create-solution`)}>
                            Создать решение
                        </Button>
                    </Card.Footer>
                }
                {isEmployer && 
                    <Card.Footer>
                        <Button variant="primary" onClick={() => navigate(`/contest/${currentContest.number}/solutions`)}>
                            Просмотреть решения
                        </Button>
                        <Button
                            variant="primary"
                            className="ms-2"
                            onClick={() => navigate(
                                `/contest/edit/${currentContest.number}`,
                                { state: JSON.parse(JSON.stringify(currentContest)) })}
                        >
                            Редактировать конкурс
                        </Button>
                    </Card.Footer>
                }
            </Card>
        </Container>
    );
};

export default observer(ContestPage);

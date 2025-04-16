import React, { useEffect, useContext, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Context } from '../main.jsx';
import { Card, Badge, Button } from 'react-bootstrap';
import { observer } from 'mobx-react-lite';

const ContestPage = () => {
    const { contest, user } = useContext(Context);
    const { number } = useParams();
    const [currentContest, setCurrentContest] = useState(null);

    const navigate = useNavigate();

    useEffect(() => {
        if (contest.selectedContest && contest.selectedContest.number == number) {
            setCurrentContest(contest.selectedContest);
        } else {
            const fetchContest = async () => {
                const fetched = await contest.fetchOneContest(number);
                setCurrentContest(fetched);
            };
            fetchContest();
        }
    }, [number, contest.selectedContest]);

    if (!currentContest) {
        return <div>Загрузка...</div>;
    }

    const isFreelancer = user.user && user.user.role === 1;

    return (
        <Card className="mb-4 shadow-sm">
            <Card.Body>
                <Card.Title className="mb-3 d-flex justify-content-between align-items-center">
                    <div>
                        {currentContest.title}
                    </div>
                </Card.Title>
            </Card.Body>
            {isFreelancer && (
                <Button
                    variant="primary"
                    size="sm"
                    onClick={() => navigate(`/contest/${currentContest.number}/create-solution`)}
                >
                    Добавить решение
                </Button>
            )}
        </Card>
    );
};

export default observer(ContestPage);

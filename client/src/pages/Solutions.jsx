import React, { useContext, useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { Container, Row, Spinner, Alert } from 'react-bootstrap';
import { Context } from "../main.jsx";
import { observer } from "mobx-react-lite";
import SolutionCard from "../components/SolutionCard.jsx";

const Solutions = () => {
    const { contest, solution, user } = useContext(Context); // Используем user вместо freelancer
    const { number } = useParams();
    const [currentContest, setCurrentContest] = useState(null);
    const [error, setError] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchData = async () => {
            setError(null);
            setLoading(true);

            try {
                // сначала получаем конкурс, если он уже есть — используем его
                let contestData;
                if (contest.currentContest && contest.currentContest.number == number) {
                    contestData = contest.currentContest;
                } else {
                    contestData = await contest.fetchOneContestByNumber(number);
                }

                if (!contestData) {
                    setError("Конкурс не найден.");
                    setLoading(false);
                    return;
                }

                setCurrentContest(contestData);

                // Загрузка решений
                await solution.fetchSolutionsByContestId(contestData.id);

                // Загрузка данных фрилансеров
                const freelancerIds = [...new Set(
                    solution.solutions.map(s => s.freelancerId)
                )];
                
                await Promise.all(
                    freelancerIds.map(id => user.fetchUserById(id))
                );

                setLoading(false);
            } catch (err) {
                console.error(err);
                setError("Ошибка при загрузке данных.");
                setLoading(false);
            }
        };

        fetchData();
    }, [number, contest, solution, user]);

    const solutions = solution.solutions;

    if (loading || !currentContest) {
        return (
            <Container className="mt-4 text-center">
                <Spinner animation="border" />
                <p>Загрузка данных конкурса...</p>
            </Container>
        );
    }

    if (error) {
        return (
            <Container className="mt-4">
                <Alert variant="danger">{error}</Alert>
            </Container>
        );
    }

    return (
        <Container className="mt-4">
            <h1>Решения конкурса «{currentContest.title}»</h1>

            {solutions.length === 0 ? (
                <p>Решений пока нет.</p>
            ) : (
                <Row>
                    {solutions.map(sol => (
                        <SolutionCard
                            key={sol.number}
                            currentSolution={sol}
                            contest={currentContest}
                            freelancer={user.getById(sol.freelancerId)}
                            showContestTitle={false}
                        />
                    ))}
                </Row>
            )}
        </Container>
    );
};

export default observer(Solutions);

import React, { useContext, useEffect, useState } from 'react';
import { Container, Row, Spinner, Alert } from 'react-bootstrap';
import { Context } from "../main.jsx";
import { observer } from "mobx-react-lite";
import SolutionCard from "../components/SolutionCard.jsx";

const MySolutions = () => {
    const { solution, user, contest } = useContext(Context);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [contestsMap, setContestsMap] = useState({}); // Для хранения загруженных конкурсов

    useEffect(() => {
        const fetchData = async () => {
            setError(null);
            setLoading(true);

            try {
                if (!user.isAuth || user.user.role !== 1) {
                    throw new Error("Доступно только для фрилансеров");
                }

                // Загружаем решения
                await solution.fetchSolutionsByFreelancerId(user.user.id);
                
                // Загружаем конкурсы и создаем карту
                const contestIds = [...new Set(solution.solutions.map(s => s.contestId))];
                const contests = await Promise.all(
                    contestIds.map(id => contest.fetchOneContestById(id))
                );
                
                // Создаем объект с соответствием contestId -> contestData
                const map = {};
                contests.forEach(c => {
                    if (c) map[c.id] = c;
                });
                setContestsMap(map);

            } catch (err) {
                console.error(err);
                setError(err.message);
            } finally {
                setLoading(false);
            }
        };

        fetchData();
    }, [user.isAuth]);

    if (loading) {
        return (
            <Container className="mt-4 text-center">
                <Spinner animation="border" />
                <p>Загрузка ваших решений...</p>
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
            <h1>Мои решения</h1>
            
            {solution.solutions.length === 0 ? (
                <p>У вас пока нет решений.</p>
            ) : (
                <Row>
                    {solution.solutions.map(sol => {
                        const contestData = contestsMap[sol.contestId];
                        return (
                            <SolutionCard
                                key={sol.id}
                                currentSolution={sol}
                                contest={contestData || { title: "Неизвестный конкурс" }}
                                freelancer={user.user}
                                showContestTitle={true}
                                showFreelancerLogin={false}
                            />
                        );
                    })}
                </Row>
            )}
        </Container>
    );
};

export default observer(MySolutions);

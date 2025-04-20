import React, { useEffect, useContext, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Context } from '../main.jsx';
import { Container, Card, Badge, Button, Row, Col } from 'react-bootstrap';
import { observer } from 'mobx-react-lite';
import Markdown from 'markdown-to-jsx';
import ConfirmationModal from '../components/ConfirmationModal';
import ChangeSolutionStatusModal from '../components/ChangeSolutionStatusModal';

const SolutionPage = () => {
    const { solution, contest, user } = useContext(Context);
    const { number } = useParams();
    const [currentSolution, setCurrentSolution] = useState(null);
    const [currentContest, setCurrentContest] = useState(null);
    const [freelancer, setFreelancer] = useState(null);
    const [error, setError] = useState(null);
    const [showDeleteModal, setShowDeleteModal] = useState(false);
    const [showStatusModal, setShowStatusModal] = useState(false);

    const navigate = useNavigate();

    useEffect(() => {
        const fetchData = async () => {
            try {
                let sol;
    
                if (solution.currentSolution && solution.currentSolution.number == number) {
                    sol = solution.currentSolution;
                } else {
                    sol = await solution.fetchSolutionByNumber(number);
                    if (!sol) {
                        setError("Решение не найдено.");
                        return;
                    }
                }

                setCurrentSolution(sol);

                const fetchedContest = await contest.fetchOneContestById(sol.contestId);
                setCurrentContest(fetchedContest);

                await user.fetchUserById(sol.freelancerId);
                setFreelancer(user.getById(sol.freelancerId));

            } catch (err) {
                console.error(err);
                setError(err.message);
            }
        };
        fetchData();
    }, [number]);

    if (error) {
        return <Container>{error}</Container>;
    }

    if (!currentSolution || !currentContest) {
        return <Container>Загрузка...</Container>;
    }

    const isOwner = user.user?.id === currentSolution.freelancerId;
    const isEmployer = user.user?.role === 2;
    const isCreated = currentSolution.createdAt === currentSolution.updatedAt;

    const formatDate = (dateString) => {
        return new Date(dateString).toLocaleDateString('ru-RU', {
            day: '2-digit',
            month: 'long',
            year: 'numeric',
            hour: '2-digit',
            minute: '2-digit'
        });
    };

    const handleDelete = async () => {
        try {
            await solution.deleteSolutionById(currentSolution.id);
            navigate('/');
        } catch (error) {
            console.error("Ошибка удаления:", error);
        }
    };

    const handleStatusChange = async (newStatus) => {
        try {
            if (currentSolution.status === newStatus) {
                return;
            }

            const updatedSolution = await solution.updateSolutionStatus(
                currentSolution.id,
                newStatus
            );

            setCurrentSolution(updatedSolution);
        } catch (error) {
            console.error('Ошибка изменения статуса:', error);
        }
    };

    const employerLogin = (user.getById(currentContest.employerId)).login;

    return (
        <Container>
            <Card className="mb-4 shadow-sm">
                <Card.Header className="position-relative">
                    <div className="d-flex justify-content-between align-items-start flex-wrap">
                        {/* Левая часть: Заголовок и конкурс */}
                        <div>
                            <Card.Title className="mb-2">
                                <h1>{currentSolution.title}</h1>
                            </Card.Title>
                            <h5 className="text-muted mb-2">
                                Конкурс «{currentContest.title}» от {user.getById(currentContest.employerId)?.login || 'Неизвестно'}
                            </h5>
                            <div className="d-inline-block">
                                <span
                                    style={{
                                        display: 'inline-block',
                                        fontSize: '1.4rem',
                                        fontWeight: '700',
                                        lineHeight: '1',
                                        color: solution.getStatus(currentSolution.status).textColor,
                                        backgroundColor: solution.getStatus(currentSolution.status).color,
                                        padding: '0.35em 0.65em',
                                        borderRadius: '0.375rem',
                                        whiteSpace: 'nowrap'
                                    }}
                                >
                                    {solution.getStatus(currentSolution.status).label}
                                </span>
                            </div>
                        </div>

                        {/* Правая часть: Фрилансер */}
                        <div className="text-end d-flex flex-column justify-content-center align-items-end ms-auto mt-2">
                            <h5 className="text-muted">
                                {freelancer?.login || 'Неизвестно'}
                            </h5>
                        </div>
                    </div>

                    {/* Даты в правом нижнем углу */}
                    <div
                        style={{
                            position: 'absolute',
                            bottom: '0.5rem',
                            right: '1rem',
                            textAlign: 'right'
                        }}
                    >
                        <h5 className="mb-1">
                            <strong>Создано:</strong> {formatDate(currentSolution.createdAt)}
                        </h5>
                        {!isCreated && (
                            <h5 className="mb-1">
                                <strong>Обновлено:</strong> {formatDate(currentSolution.updatedAt)}
                            </h5>
                        )}
                    </div>
                </Card.Header>

                <Card.Body>
                    {/* Описание */}
                    <Card.Subtitle className="mb-2">
                        <h2>Описание:</h2>
                    </Card.Subtitle>
                    <Markdown options={{ disableParsingRawHTML: true }}>
                        {currentSolution.description}
                    </Markdown>
                </Card.Body>

                <Card.Footer className="d-flex justify-content-between">
                    <Button
                        variant="secondary" 
                        onClick={() => navigate(`/contest/${currentContest.number}`)}
                    >
                        Перейти к конкурсу
                    </Button>

                    <div>
                        {isOwner && (
                            <>
                                <Button 
                                    variant="primary" 
                                    className="me-2"
                                    onClick={{/* () => navigate(`/solution/${currentSolution.number}/edit`)*/}}
                                >
                                    Редактировать решение
                                </Button>
                                <Button 
                                    variant="danger"
                                    onClick={() => setShowDeleteModal(true)}
                                >
                                    Удалить решение
                                </Button>

                                <ConfirmationModal
                                    show={showDeleteModal}
                                    onHide={() => setShowDeleteModal(false)}
                                    onConfirm={handleDelete}
                                    title="Удаление решения"
                                    message="Вы уверены, что хотите удалить решение?"
                                    confirmText="Удалить"
                                    cancelText="Отмена"
                                />
                            </>
                        )}

                        {isEmployer && (
                            <>
                                <Button 
                                    variant="warning"
                                    onClick={() => setShowStatusModal(true)}
                                    className='me-2'
                                >
                                    Изменить статус
                                </Button>

                                <ChangeSolutionStatusModal
                                    show={showStatusModal}
                                    onHide={() => setShowStatusModal(false)}
                                    currentStatus={currentSolution.status}
                                    onSave={handleStatusChange}
                                />

                                <Button 
                                    variant="success" 
                                    className="me-2"
                                    onClick={() => navigate(`/solution/${currentSolution.number}/create-review`)} // Добавить routes
                                >
                                    Оставить отзыв
                                </Button>
                            </>
                        )}
                    </div>
                </Card.Footer>
            </Card>
        </Container>
    );
};

export default observer(SolutionPage);

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
    const [loading, setLoading] = useState(true);
    const [showDeleteModal, setShowDeleteModal] = useState(false);
    const [showStatusModal, setShowStatusModal] = useState(false);

    const navigate = useNavigate();

    useEffect(() => {
        const fetchData = async () => {
            try {
                const existingSolution = solution.getSolutionIfExists(number);
                const sol = existingSolution || await solution.fetchSolutionByNumber(number);
                if (!sol) throw new Error("Решение не найдено");
                setCurrentSolution(sol);

                const cont = await contest.fetchOneContestById(sol.contestId);
                setCurrentContest(cont);

                await user.fetchUserById(sol.freelancerId);
                setFreelancer(user.getById(sol.freelancerId));
            } catch (err) {
                console.error(err);
                setError(err.message);
            } finally {
                setLoading(false);
            }
        };

        fetchData();
    }, [number]);

    if (loading) return <Container>Загрузка...</Container>;
    if (error) return <Container>{error}</Container>;
    if (!currentSolution || !currentContest) return <Container>Данные не загружены</Container>;

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
            if (currentSolution.status === newStatus) return;
            const updatedSolution = await solution.updateSolutionStatus(currentSolution.id, newStatus);
            setCurrentSolution(updatedSolution);
        } catch (error) {
            console.error('Ошибка изменения статуса:', error);
        }
    };

    return (
        <Container>
            <Card className="mb-4 shadow-sm">
                <Card.Header>
                    <Card.Title>
                        <h1>Решение конкурса «{currentContest.title}»</h1>
                    </Card.Title>
                    <div className="d-flex align-items-center mt-2">
                        <Badge
                            style={{
                                backgroundColor: solution.getStatus(currentSolution.status).color,
                                color: solution.getStatus(currentSolution.status).textColor,
                                fontSize: '0.85rem'
                            }}
                        >
                            {solution.getStatus(currentSolution.status).label}
                        </Badge>
                    </div>
                </Card.Header>

                <Card.Body>
                    <div className="mb-4">
                        <div><strong>Создано:</strong> {formatDate(currentSolution.createdAt)}</div>
                        {!isCreated && (
                            <div><strong>Обновлено:</strong> {formatDate(currentSolution.updatedAt)}</div>
                        )}
                    </div>

                    <Card.Subtitle className="mb-3">
                        <strong>Фрилансер:</strong> {freelancer?.login || 'Неизвестно'}
                    </Card.Subtitle>

                    <Card.Subtitle className="mb-2">
                        <h3>Описание решения</h3>
                    </Card.Subtitle>
                    <Markdown options={{ disableParsingRawHTML: true }}>
                        {currentSolution.description}
                    </Markdown>

                    {currentSolution.files && currentSolution.files.length > 0 && (
                        <div className="mt-4">
                            <h4>Прикрепленные файлы:</h4>
                            <Row>
                                {currentSolution.files.map((file, index) => (
                                    <Col md={4} key={index}>
                                        <Card className="mb-2 p-2">
                                            <a href={file.url} target="_blank" rel="noreferrer">
                                                {file.name || `Файл ${index + 1}`}
                                            </a>
                                        </Card>
                                    </Col>
                                ))}
                            </Row>
                        </div>
                    )}
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
                                    variant="info"
                                    className="me-2"
                                    onClick={() => navigate(`/solution/${currentSolution.number}/reviews`)}
                                >
                                    Просмотреть отзывы
                                </Button>
                                <Button
                                    variant="primary"
                                    className="me-2"
                                    onClick={() => navigate(`/solution/${currentSolution.number}/edit`)}
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
                                    onClick={() => navigate(`/solution/${currentSolution.number}/create-review`)}
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

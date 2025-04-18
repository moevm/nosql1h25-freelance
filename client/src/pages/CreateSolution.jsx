import React, { useEffect, useContext, useState, useCallback } from 'react';
import { Container, Form, Button, Modal } from 'react-bootstrap';
import { Context } from '../main.jsx';
import { sendData } from '../services/apiService.js';
import { useNavigate, useParams } from 'react-router-dom';
import { observer } from "mobx-react-lite";
import Markdown from 'markdown-to-jsx';

const CreateSolution = () => {
    const { contest, user } = useContext(Context);
    const { number } = useParams();
    const [error, setError] = useState(null);

    const navigate = useNavigate();

    if (contest.currentContest && contest.currentContest.number == number) {
        contest.setCurrentContest(contest.currentContest);
    } else {
        const fetchContest = async () => {
            const fetched = await contest.fetchOneContestByNumber(number);
            if (fetched) {
                contest.setCurrentContest(fetched);
            } else {
                setError("Конкурс не найден.");
            }
        };
        fetchContest();
    }

    if (error) {
        return <div>{error}</div>;
    }

    const contestId = contest.currentContest.id;

    const [files, setFiles] = useState([]);
    const [imagesMap, setImagesMap] = useState({});
    const [showPreview, setShowPreview] = useState(false);
    const [showHelp, setShowHelp] = useState(false);
    const [mdDescription, setMdDescription] = useState('');

    const handleClosePreview = () => setShowPreview(false);
    const handleShowPreview = () => setShowPreview(true);
    const handleCloseHelp = () => setShowHelp(false);
    const handleShowHelp = () => setShowHelp(true);

    const handleSubmit = async (e) => {
        e.preventDefault();

        contest.validateSolutionField('description');

        if (contest.solutionForm.description.error || contest.solutionForm.files.error) {
            return;
        }

        if (!user.isAuth || !user.user?.id) {
            alert('Необходимо авторизоваться, чтобы добавить решение');
            navigate('/login');
            return;
        }

        const formData = new FormData();
        files.forEach(file => {
            formData.append('files[]', file);
        });

        const data = {
            contestId,
            freelancerId: user.user.id,
            description: contest.solutionForm.description.value
        };

        formData.append('data', JSON.stringify(data));

        try {
            const res = await sendData('/solutions', formData, true);
            contest.resetSolutionForm();
            navigate('/');
            alert('Решение успешно отправлено!');
            console.log('Ответ сервера:', res);
        } catch (error) {
            console.error('Ошибка при отправке решения:', error);
            alert('Ошибка при отправке решения');
        }
    };

    const handleFilesChange = useCallback((newFiles) => {
        const allowedTypes = contest.solutionForm.files.allowedTypes;
        const validFiles = Array.from(newFiles).filter(file => allowedTypes.includes(file.type));
        
        if (validFiles.length > contest.solutionForm.files.rules.max) {
            contest.solutionForm.files.error = contest.solutionFormErrors.files;
        } else {
            contest.solutionForm.files.error = '';
        }

        const newMap = {};
        validFiles.forEach(file => {
            if (file.type.startsWith('image/')) {
                newMap[file.name] = URL.createObjectURL(file);
            }
        });

        Object.values(imagesMap).forEach(URL.revokeObjectURL);
        setFiles(validFiles);
        setImagesMap(newMap);
    }, [imagesMap]);

    useEffect(() => {
        return () => {
            Object.values(imagesMap).forEach(URL.revokeObjectURL);
        };
    }, [imagesMap]);

    const regex = /(!\[[^\]]*\])\(([^)]+)\)/g;
    useEffect(() => {
        const updatedMarkdown = contest.solutionForm.description.value.replace(regex, (match, p1, p2) => {
            return imagesMap[p2] ? `${p1}(${imagesMap[p2]})` : `${p1}(${p2})`;
        });
        setMdDescription(updatedMarkdown);
    }, [contest.solutionForm.description.value, imagesMap]);

    useEffect(() => {
            return () => {
                contest.resetSolutionForm();
            };
        }, []);

    return (
        <Container className="mt-4">
            <h1 className="mb-4">Отправить решение</h1>
            <Form noValidate onSubmit={handleSubmit}>
                <Form.Group className="mb-3">
                    <Form.Control
                        as="textarea"
                        rows={10}
                        placeholder="Описание решения"
                        value={contest.solutionForm.description.value}
                        onChange={e => contest.setSolutionFormField('description', e.target.value)}
                        isInvalid={contest.solutionForm.description.error.length > 0}
                        isValid={contest.solutionForm.description.error === '' && !!contest.solutionForm.description.value}
                        required
                    />
                    <Form.Control.Feedback type="invalid">
                        {contest.solutionForm.description.error}
                    </Form.Control.Feedback>
                </Form.Group>
                <Form.Group className="mb-3">
                    <Form.Control
                        type="file"
                        multiple
                        onChange={e => handleFilesChange(e.target.files)}
                        isInvalid={contest.solutionForm.files.error.length > 0}
                    />
                    <Form.Control.Feedback type="invalid">
                        {contest.solutionForm.files.error}
                    </Form.Control.Feedback>
                    <Form.Text className="text-muted">
                        Поддерживаемые форматы: .zip, .png, .jpg, .jpeg, .gif. Не более {contest.solutionForm.files.rules.max} файлов.
                    </Form.Text>
                </Form.Group>
                <Button className="me-3" type="submit">Отправить</Button>
                <Button className="me-3" onClick={handleShowPreview}>Предпросмотр</Button>
                <Button className="me-3" onClick={handleShowHelp}>Справка</Button>
            </Form>

            <Modal show={showPreview} onHide={handleClosePreview} size="xl" centered scrollable>
                <Modal.Header>
                    <Modal.Title>Предпросмотр описания решения</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <Markdown options={{ disableParsingRawHTML: true }}>
                        {mdDescription}
                    </Markdown>
                </Modal.Body>
                <Modal.Footer>
                    <Button variant="primary" onClick={handleClosePreview}>Закрыть</Button>
                </Modal.Footer>
            </Modal>

            <Modal show={showHelp} onHide={handleCloseHelp} size="lg" centered>
                <Modal.Header>
                    <Modal.Title>Справка по оформлению</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <div style={{ whiteSpace: 'pre-line' }}>
                        Описание решения должно содержать от {contest.solutionForm.description.rules.min} до {contest.solutionForm.description.rules.max} символов.
                        Файлы: zip-архивы и изображения (jpg, png, gif), не более {contest.solutionForm.files.rules.max} штук.
                        Используйте Markdown для оформления текста.
                        <br /><br />
                        Пример изображения: ![alt](image.jpg)
                        <br /><br />
                        Подробнее о Markdown:{" "}
                        <a href="https://www.markdownguide.org/cheat-sheet/" target="_blank" rel="noopener noreferrer">
                            https://www.markdownguide.org/cheat-sheet/
                        </a>
                    </div>
                </Modal.Body>
                <Modal.Footer>
                    <Button variant="primary" onClick={handleCloseHelp}>Закрыть</Button>
                </Modal.Footer>
            </Modal>
        </Container>
    );
};

export default observer(CreateSolution);

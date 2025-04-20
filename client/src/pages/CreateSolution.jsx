import React, { useEffect, useContext, useState, useCallback } from 'react';
import { Container, Form, Button, Modal } from 'react-bootstrap';
import { Context } from '../main.jsx';
import { sendData } from '../services/apiService.js';
import { useNavigate, useParams } from 'react-router-dom';
import { observer } from "mobx-react-lite";
import Markdown from 'markdown-to-jsx';

const CreateSolution = () => {
    const { contest, solution, user } = useContext(Context);
    const { number } = useParams();
    const [error, setError] = useState(null);
    const navigate = useNavigate();

    useEffect(() => {
        const fetch = async () => {
            if (contest.currentContest && contest.currentContest.number == number) {
                contest.setCurrentContest(contest.currentContest);
            } else {
                const fetched = await contest.fetchOneContestByNumber(number);
                if (fetched) {
                    contest.setCurrentContest(fetched);
                } else {
                    setError("Конкурс не найден.");
                }
            }
        };
        fetch();
    }, [number, contest]);

    const contestId = contest.currentContest?.id;

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

        solution.validateField('description');

        if (solution.form.description.error || solution.form.files.error) {
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
            description: solution.form.description.value
        };

        formData.append('data', JSON.stringify(data));

        try {
            const res = await sendData('/solutions', formData, true);
            solution.resetForm();
            navigate('/');
            alert('Решение успешно отправлено!');
            console.log('Ответ сервера:', res);
        } catch (error) {
            console.error('Ошибка при отправке решения:', error);
            alert('Ошибка при отправке решения');
        }
    };

    const handleFilesChange = useCallback((newFiles) => {
        const allowedTypes = solution.form.files.allowedTypes;
        const validFiles = Array.from(newFiles).filter(file => allowedTypes.includes(file.type));

        if (validFiles.length > solution.form.files.rules.max) {
            solution.form.files.error = solution.solutionFormErrors.files;
        } else {
            solution.form.files.error = '';
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
    }, [imagesMap, solution]);

    useEffect(() => {
        return () => {
            Object.values(imagesMap).forEach(URL.revokeObjectURL);
        };
    }, [imagesMap]);

    const regex = /(!\[[^\]]*\])\(([^)]+)\)/g;
    useEffect(() => {
        const updatedMarkdown = solution.form.description.value.replace(regex, (match, p1, p2) => {
            return imagesMap[p2] ? `${p1}(${imagesMap[p2]})` : `${p1}(${p2})`;
        });
        setMdDescription(updatedMarkdown);
    }, [solution.form.description.value, imagesMap]);

    useEffect(() => {
        return () => {
            solution.resetForm();
        };
    }, [solution]);

    if (error) return <div>{error}</div>;

    return (
        <Container className="mt-4">
            <h1 className="mb-4">Отправить решение</h1>
            <Form noValidate onSubmit={handleSubmit}>
                <Form.Group className="mb-3">
                    <Form.Control
                        as="textarea"
                        rows={10}
                        placeholder="Описание решения"
                        value={solution.form.description.value}
                        onChange={e => solution.setFormField('description', e.target.value)}
                        isInvalid={solution.form.description.error.length > 0}
                        isValid={solution.form.description.error === '' && !!solution.form.description.value}
                        required
                    />
                    <Form.Control.Feedback type="invalid">
                        {solution.form.description.error}
                    </Form.Control.Feedback>
                </Form.Group>
                <Form.Group className="mb-3">
                    <Form.Control
                        type="file"
                        multiple
                        onChange={e => handleFilesChange(e.target.files)}
                        isInvalid={solution.form.files.error.length > 0}
                    />
                    <Form.Control.Feedback type="invalid">
                        {solution.form.files.error}
                    </Form.Control.Feedback>
                    <Form.Text className="text-muted">
                        Поддерживаемые форматы: .zip, .png, .jpg, .jpeg, .gif. Не более {solution.form.files.rules.max} файлов.
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
                        Описание решения должно содержать от {solution.form.description.rules.min} до {solution.form.description.rules.max} символов.
                        Файлы: zip-архивы и изображения (jpg, png, gif), не более {solution.form.files.rules.max} штук.
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

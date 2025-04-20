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

        if (!solution.validateForm()) {
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
            title: solution.form.title.value,
            annotation: solution.form.annotation.value,
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
            <h1 className="mb-4">Создание решения</h1>
            <Form noValidate onSubmit={handleSubmit}>
                <Form.Group className="mb-3">
                    <Form.Control
                        placeholder="Название"
                        value={solution.form.title.value}
                        onChange={(e) => solution.setFormField('title', e.target.value)}
                        isInvalid={solution.form.title.error.length > 0}
                        isValid={solution.form.title.error === '' && !!solution.form.title.value}
                    />
                    <Form.Control.Feedback type="invalid">
                        {solution.form.title.error}
                    </Form.Control.Feedback>
                </Form.Group>
                <Form.Group className="mb-3">
                    <Form.Control
                        placeholder="Аннотация"
                        value={solution.form.annotation.value}
                        onChange={e => solution.setFormField('annotation', e.target.value)}
                        isInvalid={solution.form.annotation.error.length > 0}
                        isValid={solution.form.annotation.error === '' && !!solution.form.annotation.value}
                        required
                    />
                    <Form.Control.Feedback type="invalid">
                        {solution.form.annotation.error}
                    </Form.Control.Feedback>
                </Form.Group>
                <Form.Group className="mb-3">
                    <Form.Control
                        as="textarea"
                        rows={10}
                        placeholder="Описание"
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
                        Название должно содержать от {solution.form.title.rules.min} до {solution.form.title.rules.max} символов.<br />
                        Аннотация должна содержать от {solution.form.annotation.rules.min} до {solution.form.annotation.rules.max} символов.<br />
                        Описание должно содержать от {solution.form.description.rules.min} до {solution.form.description.rules.max} символов.<br />
                        Файлы: zip-архивы и изображения (.zip, .png, .jpg, .jpeg, .gif.), не более {solution.form.files.rules.max} штук.<br />
                        <br />
                        Используйте Markdown для оформления описания.<br />
                        Подробнее:{" "}
                            <a href="https://www.markdownguide.org/cheat-sheet/" target="_blank" rel="noopener noreferrer">
                            https://www.markdownguide.org/cheat-sheet/
                            </a><br />
                        <br />
                        Пример вставки изображения в Markdown-описание:<br />
                        ![alt](image.jpg)<br />
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

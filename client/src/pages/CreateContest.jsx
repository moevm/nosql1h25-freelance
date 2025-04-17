import React, { useEffect, useContext, useState, useCallback } from 'react';
import { Container, Form, Button, Dropdown, Modal } from 'react-bootstrap';
import { Context } from '../main.jsx';
import { sendData } from '../services/apiService.js';
import { useNavigate } from 'react-router-dom';
import { observer } from "mobx-react-lite";
import Markdown from 'markdown-to-jsx'

const CreateContest = () => {
    const { contest, user } = useContext(Context);
    const navigate = useNavigate();

    const [files, setFiles] = useState([]);
    const [imagesMap, setImagesMap] = useState({});
    const [showPreview, setShowPreview] = useState(false);
    const [showHelp, setShowHelp] = useState(false);
    const [mdDescription, setMdDescription] = useState('');
    const [validated, setValidated] = useState(false);

    const handleClosePreview = () => setShowPreview(false);
    const handleShowPreview = () => setShowPreview(true);
    const handleCloseHelp = () => setShowHelp(false);
    const handleShowHelp = () => setShowHelp(true);

    useEffect(() => {
        contest.fetchTypes();
    }, []);

    const handleSubmit = async (event) => {
        event.preventDefault();
        
        if (contest.validateForm()) {
            setValidated(true);
        } else {
            return;
        }

        if (!user.isAuth || !user.user?.id) {
            alert('Для создания конкурса необходимо войти в систему');
            navigate('/login');
            return;
        }

        const formData = new FormData();
        files.forEach(file => {
            formData.append('files[]', file);
        })

        let date = new Date(contest.form.endBy.value)
        date.setUTCHours(23, 59, 59, 999);

        const data = {
            employerId: user.user.id,
            title: contest.form.title.value,
            annotation: contest.form.annotation.value,
            prizepool: parseInt(contest.form.prizepool.value),
            description: contest.form.description.value,
            endBy: date.toISOString(),
            type: String(contest.form.type.value),
            status: 0
        };

        formData.append('data', JSON.stringify(data));

        try {
            const res = await sendData('/contests', formData, true);
            alert("Конкурс успешно добавлен!");
            console.log('Ответ сервера:', res);
        } catch (error) {
            console.error("Ошибка при отправке:", error);
            alert("Ошибка при создании конкурса");
        }
    };

    const handleFilesChange = useCallback((newFiles) => {
        const validFiles = Array.from(newFiles).filter(file => 
            file.type.startsWith('image/') && 
            file.size < 5 * 1024 * 1024 // 5MB limit
        );
        const newMap = {};
        validFiles.forEach((file, index) => {
            newMap[`${file.name}`] = URL.createObjectURL(file);
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

    useEffect(() => {
        const updatedMarkdown = contest.form.description.value.replace(regex, (match, p1, p2) => {
          return imagesMap[p2] ? `${p1}(${imagesMap[p2]})` : `${p1}(${p2})`;
        });
        setMdDescription(updatedMarkdown);
      }, [contest.form.description.value, imagesMap]);

    const regex = /(!\[[^\]]*\])\(([^)]+)\)/g;

    return (
        <Container className="mt-4">
            <h1 className="mb-4">Добавить конкурс</h1>
            <Form noValidate validated={validated} onSubmit={handleSubmit}>
                <Form.Group className="mb-3">
                    <Dropdown>
                        <Dropdown.Toggle variant={contest.form.type.error ? 'danger' : contest.form.type.value ? 'success' : 'primary'}>
                            {contest.form.type.value ? contest.form.type.value : "Выберите тип"}
                        </Dropdown.Toggle>
                        <Dropdown.Menu>
                            {contest.types.map((t) => (
                                <Dropdown.Item key={t.id} onClick={() => contest.setFormField('type', t.name)}>
                                    {t.name}
                                </Dropdown.Item>
                            ))}
                        </Dropdown.Menu>
                    </Dropdown>
                </Form.Group>
                <Form.Group className="mb-3">
                    <Form.Control
                        placeholder="Название"
                        value={contest.form.title.value}
                        onChange={(e) => contest.setFormField('title', e.target.value)}
                        isInvalid={!!contest.form.title.error}
                        isValid={!!contest.form.title.value}
                        required
                    />
                    <Form.Control.Feedback type="invalid">
                        {contest.form.title.error}
                    </Form.Control.Feedback>
                </Form.Group>
                <Form.Group className="mb-3">
                    <Form.Control
                        placeholder="Краткое описание"
                        value={contest.form.annotation.value}
                        onChange={e => contest.setFormField('annotation', e.target.value)}
                        isInvalid={!!contest.form.annotation.error}
                        isValid={!!contest.form.annotation.value}
                        required
                    />
                    <Form.Control.Feedback type="invalid">
                        {contest.form.annotation.error}
                    </Form.Control.Feedback>
                </Form.Group>
                <Form.Group className="mb-3">
                    <Form.Control
                        as="textarea"
                        rows={10}
                        placeholder="Полное описание"
                        value={contest.form.description.value}
                        onChange={e => contest.setFormField('description', e.target.value)}
                        isInvalid={!!contest.form.description.error}
                        isValid={!!contest.form.description.value}
                    />
                    <Form.Control.Feedback type="invalid">
                        {contest.form.description.error}
                    </Form.Control.Feedback>
                </Form.Group>
                <Form.Group className='mb-3'>
                    <Form.Control
                        placeholder="Приз"
                        type="number"
                        value={contest.form.prizepool.value}
                        onChange={e => contest.setFormField('prizepool', e.target.value)}
                        isInvalid={!!contest.form.prizepool.error}
                        isValid={!!contest.form.prizepool.value}
                    />
                    <Form.Control.Feedback type="invalid">
                        {contest.form.prizepool.error}
                    </Form.Control.Feedback>
                </Form.Group>
                <Form.Group className="mb-3">
                    <Form.Control
                        type="date"
                        value={contest.form.endBy.value}
                        onChange={e => contest.setFormField('endBy', e.target.value)}
                        isInvalid={!!contest.form.endBy.error}
                        isValid={!!contest.form.endBy.value}
                    />
                    <Form.Control.Feedback type="invalid">
                        {contest.form.endBy.error}
                    </Form.Control.Feedback>
                </Form.Group>
                <Form.Control
                    className="mb-3"
                    type="file"
                    multiple
                    onChange={e => handleFilesChange(e.target.files)}
                />
                <Button className="me-3" type="submit">Опубликовать</Button>
                <Button className="me-3" onClick={handleShowPreview}>Предпросмотр</Button>
                <Button className="me-3" onClick={handleShowHelp}>Справка</Button>
            </Form>

            

            <Modal show={showPreview} onHide={handleClosePreview} size='xl' centered scrollable>
                <Modal.Header>
                    <Modal.Title>{contest.form.title.value}</Modal.Title>
                </Modal.Header>
                <Modal.Body style={{ overflowY: 'auto' }}>
                    <Markdown options={{ disableParsingRawHTML: true }}>
                        {mdDescription}
                    </Markdown>
                </Modal.Body>
                <Modal.Footer>
                    <Button variant='primary' onClick={handleClosePreview}>Закрыть предпросмотр</Button>
                </Modal.Footer>
            </Modal>

            <Modal show={showHelp} onHide={handleCloseHelp} size='lg' centered>
                <Modal.Header>
                    <Modal.Title>Справка</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <div style={{ whiteSpace: 'pre-line' }}>
                        Для создания конкурса распишите подробно всю информацию в поле "Полное описание" в формате Markdown.
                        <br /><br />
                        Справка:{" "}
                        <a 
                        href="https://www.markdownguide.org/cheat-sheet/" 
                        target="_blank" 
                        rel="noopener noreferrer"
                        >
                        https://www.markdownguide.org/cheat-sheet/
                        </a>
                        <br /><br />
                        Чтобы отобразить изображения загруженных файлов, укажите вместо ссылки название файла, как в этом примере - ![Image](image.png)
                    </div>
                </Modal.Body>
                <Modal.Footer>
                    <Button variant='primary' onClick={handleCloseHelp}>Закрыть справку</Button>
                </Modal.Footer>
            </Modal>
            
        </Container>
    );
};

export default observer(CreateContest);
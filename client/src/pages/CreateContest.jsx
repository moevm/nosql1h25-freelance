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

    const [type, setType] = useState(null);
    const [annotation, setAnnotation] = useState('');
    const [description, setDescription] = useState('');
    const [prizepool, setPrizepool] = useState('');
    const [endBy, setEndBy] = useState('');
    const [title, setTitle] = useState('');
    const [files, setFiles] = useState([]);
    const [imagesMap, setImagesMap] = useState({});
    const [showPreview, setShowPreview] = useState(false);
    const [showHelp, setShowHelp] = useState(false);
    const [mdDescription, setMdDescription] = useState('');

    const handleClosePreview = () => setShowPreview(false);
    const handleShowPreview = () => setShowPreview(true);
    const handleCloseHelp = () => setShowHelp(false);
    const handleShowHelp = () => setShowHelp(true);

    useEffect(() => {
        contest.fetchTypes();
    }, []);

    const handleSubmit = async () => {
        if (!user.isAuth || !user.user?.id) {
            alert('Для создания конкурса необходимо войти в систему');
            navigate('/login');
            return;
        }

        if (!type || !annotation || !description || !prizepool || !endBy) {
            alert('Пожалуйста, заполните все поля');
            return;
        }

        const formData = new FormData();
        files.forEach(file => {
            formData.append('files[]', file);
        })

        const data = {
            employerId: user.user.id,
            title: title,
            annotation,
            prizepool: parseInt(prizepool),
            description,
            endBy: new Date(endBy).toISOString(),
            type: String(type.id),
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
        const updatedMarkdown = description.replace(regex, (match, p1, p2) => {
          return imagesMap[p2] ? `${p1}(${imagesMap[p2]})` : `${p1}(${p2})`;
        });
        setMdDescription(updatedMarkdown);
      }, [description, imagesMap]);

    const regex = /(!\[[^\]]*\])\(([^)]+)\)/g;

    return (
        <Container className="mt-4">
            <h1 className="mb-4">Добавить конкурс</h1>
            <Form>
                <Dropdown className="mb-3">
                    <Dropdown.Toggle>
                        {type ? type.name : "Выберите тип"}
                    </Dropdown.Toggle>
                    <Dropdown.Menu>
                        {contest.types.map((t) => (
                            <Dropdown.Item key={t.id} onClick={() => setType(t)}>
                                {t.name}
                            </Dropdown.Item>
                        ))}
                    </Dropdown.Menu>
                </Dropdown>
                <Form.Control
                    className="mb-3"
                    placeholder="Название"
                    value={title}
                    onChange={e => setTitle(e.target.value)}
                />
                <Form.Control
                    className="mb-3"
                    placeholder="Краткое описание"
                    value={annotation}
                    onChange={e => setAnnotation(e.target.value)}
                />
                <Form.Control
                    className="mb-3"
                    as="textarea"
                    rows={10}
                    placeholder="Полное описание"
                    value={description}
                    onChange={e => setDescription(e.target.value)}
                />
                <Form.Control
                    className="mb-3"
                    placeholder="Приз"
                    type="number"
                    value={prizepool}
                    onChange={e => setPrizepool(e.target.value)}
                />
                <Form.Control
                    className="mb-3"
                    type="date"
                    value={endBy}
                    onChange={e => setEndBy(e.target.value)}
                />
                <Form.Control
                    className="mb-3"
                    type="file"
                    multiple
                    onChange={e => handleFilesChange(e.target.files)}
                />
            </Form>
            <Button className="me-3" onClick={handleSubmit}>Опубликовать</Button>
            <Button className="me-3" onClick={handleShowPreview}>Предпросмотр</Button>
            <Button className="me-3" onClick={handleShowHelp}>Справка</Button>

            <Modal show={showPreview} onHide={handleClosePreview} size='xl' centered scrollable>
                <Modal.Header>
                    <Modal.Title>{title}</Modal.Title>
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
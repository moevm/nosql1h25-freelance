import React, { useContext, useState } from 'react';
import { Container, Form, Button, Dropdown } from 'react-bootstrap';
import { Context } from '../main.jsx';
import { sendData } from '../services/apiService.js';

const CreateContest = () => {
    const { contest } = useContext(Context);

    const [type, setType] = useState(null);
    const [annotation, setAnnotation] = useState('');
    const [description, setDescription] = useState('');
    const [prizepool, setPrizepool] = useState('');
    const [endBy, setEndBy] = useState('');

    const handleSubmit = async () => {
        if (!type || !annotation || !description || !prizepool || !endBy) {
            alert('Пожалуйста, заполните все поля');
            return;
        }

        const data = {
            employerId: "1", // временно хардкод, нужно брать из авторизации
            title: annotation.slice(0, 20),
            annotation,
            prizepool: parseInt(prizepool),
            description,
            endBy: new Date(endBy).toISOString(),
            type: type.id,
            status: 0
        };

        try {
            const res = await sendData('/contests', data);
            alert("Конкурс успешно добавлен!");
            console.log('Ответ сервера:', res);
        } catch (error) {
            console.error("Ошибка при отправке:", error);
            alert("Ошибка при создании конкурса");
        }
    };

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
                    placeholder="Краткое описание"
                    value={annotation}
                    onChange={e => setAnnotation(e.target.value)}
                />
                <Form.Control
                    className="mb-3"
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
            </Form>
            <Button onClick={handleSubmit}>Опубликовать</Button>
        </Container>
    );
};

export default CreateContest;
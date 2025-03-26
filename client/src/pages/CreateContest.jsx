import React, {useContext, useState} from 'react';
import {Container, Form, Button, Dropdown} from 'react-bootstrap';
import {Context} from "../main.jsx";

const CreateContest = () => {
    const {project} = useContext(Context)

    return (
        <Container>
            <h1>Добавить конкурс</h1>
            <Form >
                <Dropdown>
                    <Dropdown.Toggle>Выберите тип</Dropdown.Toggle>
                    <Dropdown.Menu>
                        {project.types.map((type) => (
                            <Dropdown.Item key={type.id}>{type.name}</Dropdown.Item>
                        ))}
                    </Dropdown.Menu>
                </Dropdown>
                <Form.Control
                    placeholder="Описание"
                />
                <Form.Control
                    placeholder="Приз"
                    type="number"
                />
                <Form.Control
                    type="file"
                />
            </Form>
            <Button>Опубликовать</Button>
        </Container>
    );
};

export default CreateContest;
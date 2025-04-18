import React, { useState } from 'react';
import { Modal, Button, Form } from 'react-bootstrap';

const ChangeSolutionStatusModal = ({ 
    show, 
    onHide,
    currentStatus,
    onSave 
}) => {
    const [selectedStatus, setSelectedStatus] = useState(currentStatus);

    const statusOptions = [
        { value: 1, label: 'Новое' },
        { value: 2, label: 'Просмотрено' },
        { value: 3, label: 'Победитель' },
        { value: 4, label: 'Необходимы правки' },
        { value: 5, label: 'Правки внесены' }
    ];

    const handleSave = () => {
        onSave(selectedStatus);
        onHide();
    };

    return (
        <Modal show={show} onHide={onHide} centered>
            <Modal.Header closeButton>
                <Modal.Title>Статус решения</Modal.Title>
            </Modal.Header>
            <Modal.Body>
                <Form.Group>
                    <Form.Label>Выберите новый статус:</Form.Label>
                    <Form.Select
                        value={selectedStatus}
                        onChange={(e) => setSelectedStatus(parseInt(e.target.value))}
                    >
                        {statusOptions.map(option => (
                            <option key={option.value} value={option.value}>
                                {option.label}
                            </option>
                        ))}
                    </Form.Select>
                </Form.Group>
            </Modal.Body>
            <Modal.Footer>
                <Button variant="secondary" onClick={onHide}>
                    Отмена
                </Button>
                <Button variant="primary" onClick={handleSave}>
                    Сохранить
                </Button>
            </Modal.Footer>
        </Modal>
    );
};

export default ChangeSolutionStatusModal;

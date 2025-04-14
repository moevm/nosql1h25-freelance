import React, { useState } from 'react';
import { Button, Container } from 'react-bootstrap';
import ContestTypeModal from '../components/ContestTypeModal.jsx';

const Admin = () => {
    const [showModal, setShowModal] = useState(false);

    const handleOpenModal = () => setShowModal(true);
    const handleCloseModal = () => setShowModal(false);

    const handleTypeAdded = () => {
        console.log("Тип конкурса успешно добавлен!");
    };

    return (
        <Container className="mt-4">
            <h2>Админ-панель</h2>
            <Button variant="primary" onClick={handleOpenModal}>
                Добавить тип конкурса
            </Button>

            <ContestTypeModal
                show={showModal}
                onHide={handleCloseModal}
                onSuccess={handleTypeAdded}
            />
        </Container>
    );
};

export default Admin;
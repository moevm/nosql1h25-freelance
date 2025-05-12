import React, {useState} from 'react';
import {Button, Container} from "react-bootstrap";
import ContestTypeModal from "../ContestTypeModal.jsx";

const AddContestTypePanel = () => {
    const [showModal, setShowModal] = useState(false);

    const handleOpenModal = () => setShowModal(true);
    const handleCloseModal = () => setShowModal(false);

    const handleTypeAdded = () => {
        console.log("Тип конкурса успешно добавлен!");
    };

    return (
        <div>
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
        </div>
    );
};

export default AddContestTypePanel;
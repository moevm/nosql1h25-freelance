import React from 'react';
import { Container, Row, Col, Card } from "react-bootstrap";
import AddContestTypePanel from "../components/adminComponents/AddContestTypePanel.jsx";
import ImportExportPanel from "../components/adminComponents/ImportExportPanel.jsx";

const Admin = () => {
    return (
        <Container className="mt-4">
            <Row className="gy-4">
                <Col md={6}>
                    <Card className="shadow-sm h-100">
                        <Card.Body className="d-flex flex-column justify-content-between">
                            <AddContestTypePanel />
                        </Card.Body>
                    </Card>
                </Col>

                <Col md={6}>
                    <Card className="shadow-sm h-100">
                        <Card.Body className="d-flex flex-column justify-content-between">
                            <ImportExportPanel />
                        </Card.Body>
                    </Card>
                </Col>

                <Col md={12}>
                    <Card className="shadow-sm">
                        <Card.Body>
                            <h2 style={{ color: "#543787" }}>Статистика</h2>
                            <p className="text-muted">Раздел в разработке...</p>
                        </Card.Body>
                    </Card>
                </Col>
            </Row>
        </Container>
    );
};

export default Admin;

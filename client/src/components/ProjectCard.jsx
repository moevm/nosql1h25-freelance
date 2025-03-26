import React from 'react';
import { Card, Col } from "react-bootstrap";
import { useNavigate } from 'react-router-dom';
import {PROJECT_ROUTE} from "../utils/consts.js";

const ProjectCard = ({ project }) => {
    const navigate = useNavigate()

    return (
        <Col
            md={4}
            onClick={() => navigate(PROJECT_ROUTE + '/' + project.id)}
        >
            <Card
                style={{ width: 300 }}
                border="dark"
                className="mt-2"
            >
                <Card.Body >
                    <div className="d-flex justify-content-between align-items-center">
                        <span className="text-truncate" style={{ maxWidth: '250px' }}>
                            {project.name}
                        </span>
                        <span>
                            {project.rating}
                        </span>
                    </div>
                    <div className="mt-2">
                        ОПИСАНИЕ
                    </div>
                </Card.Body>
            </Card>
        </Col>
    );
};

export default ProjectCard;
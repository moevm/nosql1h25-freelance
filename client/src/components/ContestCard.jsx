import React from 'react';
import { Card, Col } from "react-bootstrap";
import { useNavigate } from 'react-router-dom';
import {CONTEST_ROUTE} from "../utils/consts.js";

const ContestCard = ({ contest }) => {
    const navigate = useNavigate()

    return (
        <Col
            md={4}
            onClick={() => navigate(CONTEST_ROUTE + '/' + contest.id)}
        >
            <Card
                style={{ width: 300 }}
                border="dark"
                className="mt-2"
            >
                <Card.Body>
                    <div className="d-flex justify-content-between align-items-center">
                        <span className="text-truncate" style={{maxWidth: '250px'}}>
                            {contest.title}
                        </span>
                    </div>
                    <div className="mt-2">
                        <span className="text-truncate" style={{maxWidth: '250px'}}>
                            {contest.annotation}
                        </span>
                    </div>
                    <div className="mt-2">
                        <span className="text-truncate" style={{maxWidth: '250px'}}>
                            {contest.prizepool}
                        </span>
                    </div>
                </Card.Body>
            </Card>
        </Col>
    );
};

export default ContestCard;
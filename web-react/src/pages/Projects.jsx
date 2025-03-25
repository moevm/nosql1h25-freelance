import React from 'react';
import {Row, Col} from "react-bootstrap";
import TypeBar from "../components/TypeBar.jsx";
import RewardBar from "../components/RewardsBar.jsx";

const Projects = () => {
    return (
        <div>
            <Row>
                <Col md={3} >
                    <TypeBar />
                    <RewardBar />
                </Col>
                <Col md={9} >

                </Col>
            </Row>
        </div>
    );
};

export default Projects;
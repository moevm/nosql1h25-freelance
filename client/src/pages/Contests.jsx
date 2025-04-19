import React from 'react';
import {Row, Col, Container} from "react-bootstrap";
import ContestsList from "../components/ContestsList.jsx";
import EndByBar from "../components/EndByBar.jsx";
import EndAfterBar from "../components/EndAfterBar.jsx";
import SearchBar from "../components/SearchBar.jsx";
import StatusBar from "../components/StatusBar.jsx";
import TypeBar from "../components/TypeBar.jsx";
import RewardBar from "../components/RewardsBar.jsx";

const Contests = () => {
    return (
        <Container>
            <Row>
                <Col md={2}>
                    <SearchBar />
                    <TypeBar />
                    <RewardBar />
                    <EndByBar />
                    <EndAfterBar />
                    <StatusBar />
                </Col>
                <Col md={10}>
                    <ContestsList />
                </Col>
            </Row>
        </Container>
    );
};

export default Contests;

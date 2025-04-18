import React, {useContext} from 'react';
import {Row, Col, Container} from "react-bootstrap";
import TypeBar from "../components/TypeBar.jsx";
import RewardBar from "../components/RewardsBar.jsx";
import ContestsList from "../components/ContestsList.jsx";
import {Context} from "../main.jsx";
import { Link } from 'react-router-dom';
import {CREATE_CONTEST_ROUTE} from "../utils/consts.js";
import EndByBar from "../components/EndByBar.jsx";
import EndAfterBar from "../components/EndAfterBar.jsx";
import SearchBar from "../components/SearchBar.jsx";
import StatusBar from "../components/StatusBar.jsx"; // Или NavLink, если нужно активное состояние

const Contests = () => {
    const { user } = useContext(Context);

    return (
        <Container>
            <Row>
                <Col md={2}>
                    {/*<Link*/}
                    {/*    style={{ backgroundColor: '#543787' }}*/}
                    {/*    to={CREATE_CONTEST_ROUTE}*/}
                    {/*    className="btn btn-primary"*/}
                    {/*>*/}
                    {/*    Добавить конкурс*/}
                    {/*</Link>*/}
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
import React, {useContext} from 'react';
import {Row, Col, Container} from "react-bootstrap";
import TypeBar from "../components/TypeBar.jsx";
import RewardBar from "../components/RewardsBar.jsx";
import ContestsList from "../components/ContestsList.jsx";
import {Context} from "../main.jsx";
import { Link } from 'react-router-dom';
import {CREATE_CONTEST_ROUTE} from "../utils/consts.js"; // Или NavLink, если нужно активное состояние

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
                    <TypeBar />
                    <RewardBar />
                </Col>
                <Col md={10}>
                    <ContestsList />
                </Col>
            </Row>
        </Container>
    );
};

export default Contests;
import React, {useContext} from 'react';
import {Row, Col} from "react-bootstrap";
import TypeBar from "../components/TypeBar.jsx";
import RewardBar from "../components/RewardsBar.jsx";
import ContestsList from "../components/ContestsList.jsx";
import {Context} from "../main.jsx";
import { Link } from 'react-router-dom';
import {CREATE_CONTEST_ROUTE} from "../utils/consts.js"; // Или NavLink, если нужно активное состояние

const Contests = () => {
    const { user } = useContext(Context);

    return (
        <div>
            <Row>
                <Col md={3}>
                    <Link
                        to={CREATE_CONTEST_ROUTE}
                        className="btn btn-primary mb-3"
                    >
                        Добавить конкурс
                    </Link>
                    <TypeBar />
                    <RewardBar />
                </Col>
                <Col md={9}>
                    <ContestsList />
                </Col>
            </Row>
        </div>
    );
};

export default Contests;
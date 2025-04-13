import React, { useEffect, useContext } from 'react';
import { Context } from "../main.jsx";
import { Row } from "react-bootstrap";
import ContestCard from "./ContestCard.jsx";
import { observer } from "mobx-react-lite";

const ContestsList = observer(() => {
    const { contest } = useContext(Context);

    useEffect(() => {
        contest.fetchContests(); // Загружаем проекты с сервера
    }, [contest]);

    return (
        <Row>
            {contest.contests.length === 0 ? (
                <div>Загрузка проектов...</div>
            ) : (
                contest.contests.map((contestItem) => (
                    <ContestCard
                        key={contestItem.id}
                        contest={contestItem}
                        type={contest.getTypeNameById(contestItem.type)}
                    />
                ))
            )}
        </Row>
    );
});

export default ContestsList;
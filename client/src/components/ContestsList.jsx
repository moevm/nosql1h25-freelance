import React, { useEffect, useContext, useState } from 'react';
import { Context } from "../main.jsx";
import { Container, Row, Spinner } from "react-bootstrap";
import ContestCard from "./ContestCard.jsx";
import { observer } from "mobx-react-lite";

const ContestsList = observer(() => {
    const { contest } = useContext(Context);

    // const [showLoader, setShowLoader] = useState(true);
    //
    // useEffect(() => {
    //     if (!contest.isLoading) {
    //         const timer = setTimeout(() => {
    //             setShowLoader(false);
    //         }, 50); // минимум 50 мс показывать загрузку
    //         return () => clearTimeout(timer);
    //     } else {
    //         setShowLoader(true);
    //     }
    // }, [contest.isLoading]);
    //
    // if (showLoader) {
    //     return (
    //         <div className="d-flex justify-content-center my-5">
    //             <Spinner animation="border" style={{ color: '#543787' }} />
    //         </div>
    //     );
    // }

    if (contest.contests.length === 0) {
        return (
            <div className="text-center my-5">
                Нет конкурсов по выбранным фильтрам
            </div>
        );
    }

    return (
        <Row className="d-flex justify-content-center">
            {contest.contests.map((contestItem) => (
                <ContestCard
                    key={contestItem.id}
                    contest={contestItem}
                    type={contest.getTypeNameById(contestItem.type)}
                />
            ))}
        </Row>
    );
});

export default ContestsList;

import React, { useEffect, useContext, useState } from 'react';
import { Row, Spinner } from "react-bootstrap";
import { observer } from "mobx-react-lite";
import { Context } from "../main.jsx";
import SolutionCard from './SolutionCard.jsx';

const SolutionsList = ({ showContestTitle, showFreelancerLogin }) => {
    const { contest, solution } = useContext(Context);
    const [showLoader, setShowLoader] = useState(false);

    useEffect(() => {
        if (solution.isLoading) {
            setShowLoader(true);
        } else {
            const timer = setTimeout(() => {
                setShowLoader(false);
            }, 100);
            return () => clearTimeout(timer);
        }
    }, [solution.isLoading]);

    if (showLoader) {
        return (
            <div className="d-flex justify-content-center my-5">
                <Spinner animation="border" style={{ color: '#543787' }} />
            </div>
        );
    }

    if (solution.contests.length === 0) {
        return (
            <div className="text-center my-5">
                Нет решений по выбранным фильтрам
            </div>
        );
    }

    return (
        <Row className="d-flex justify-content-center">
            {solution.contests.map((solutionItem) => (
                <SolutionCard
                    key={solutionItem.number}
                    currentSolution={solutionItem}
                    contest={contest.fetchOneContestById(solutionItem.contestId)}
                    freelancer={user.getById(solutionItem.freelancerId)}
                    showContestTitle={showContestTitle}
                    showFreelancerLogin={showFreelancerLogin}
                />
            ))}
        </Row>
    );
};

export default observer(SolutionsList);

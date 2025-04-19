import React, { useContext, useEffect } from 'react';
import { observer } from "mobx-react-lite";
import { Context } from "../main.jsx";
import SolutionListWithFilters from "../components/SolutionListWithFilters.jsx"

const Solutions = () => {
    const { contest, solution, user } = useContext(Context);

    useEffect(() => {
        if (user.user.id) {
            solution.setFreelancerId(null);
            solution.setContestId(contest.currentContest.id);
        }
    }, [user]);

    return (
        <>
            <SolutionListWithFilters
                showContestTitle={false}
                showFreelancerLogin={true}
            />
        </>
    );
};

export default observer(Solutions);

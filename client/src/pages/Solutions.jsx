import React, { useContext, useEffect } from 'react';
import { observer } from "mobx-react-lite";
import { useParams } from 'react-router-dom';
import { Context } from "../main.jsx";
import SolutionListWithFilters from "../components/SolutionListWithFilters.jsx"

const Solutions = () => {
    const { contest, solution, user } = useContext(Context);
    const { number } = useParams();

    useEffect(() => {
        const init = async () => {
            if (user.user.id) {
                solution.setFreelancerId(null);
                const contestId = contest.currentContest?.id 
                    || (await contest.fetchOneContestByNumber(number))?.id;
    
                solution.setContestId(contestId);
            }
        };

        init();
    }, [user]);

    return (
        <>
            <SolutionListWithFilters
                showContestTitle={false}
                showFreelancerLogin={true}
                searchForMySolutions={false}
            />
        </>
    );
};

export default observer(Solutions);

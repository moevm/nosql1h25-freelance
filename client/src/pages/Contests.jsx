import React, {useContext, useEffect, useState} from 'react';
import { Context } from "../main.jsx";
import ContestListWithFilters from "../components/ContestListWithFilters.jsx"; // Иконка фильтра

const Contests = () => {
    const { contest, user } = useContext(Context);
    const [open, setOpen] = useState(false);

    useEffect(() => {
        if (user.user.id) {
            contest.setEmployerId(null);
            // contest.setLoading(true);
        }
    }, [user]);

    return (
        <>
            <ContestListWithFilters />
        </>
    );
};

export default Contests;

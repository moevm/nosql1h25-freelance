import React, {useContext} from 'react';
import {Context} from "../main.jsx";
import {Row} from "react-bootstrap";
import ContestCard from "./ContestCard.jsx";

const ContestsList = () => {
    const {project} = useContext(Context);

    return (
        <Row>
            {project.projects.map((project) => (
                <ContestCard key={project.id} project={project} />
            ))}
        </Row>
    );
};

export default ContestsList;
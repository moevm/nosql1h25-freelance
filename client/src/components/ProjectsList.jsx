import React, {useContext} from 'react';
import {Context} from "../main.jsx";
import {Row} from "react-bootstrap";
import ProjectCard from "./ProjectCard.jsx";

const ProjectsList = () => {
    const {project} = useContext(Context);

    return (
        <Row>
            {project.projects.map((project) => (
                <ProjectCard key={project.id} project={project} />
            ))}
            
        </Row>
    );
};

export default ProjectsList;
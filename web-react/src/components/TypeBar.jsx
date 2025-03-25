import React, {useContext} from 'react';
import {observer} from "mobx-react-lite";
import {Context} from "../main.jsx";
import {ListGroup} from "react-bootstrap";

const TypeBar = () => {
    const {project} = useContext(Context);

    return (
        <ListGroup>
            {project?.types?.map((type) => (
                <ListGroup.Item key={type.id}>
                    {type.name}
                </ListGroup.Item>
            ))}
        </ListGroup>
    );
};

export default observer(TypeBar);
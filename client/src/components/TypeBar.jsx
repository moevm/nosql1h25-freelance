import React, {useContext} from 'react';
import {observer} from "mobx-react-lite";
import {Context} from "../main.jsx";
import {ListGroup} from "react-bootstrap";

const TypeBar = () => {
    const {contest} = useContext(Context);

    return (
        <ListGroup>
            {contest?.types?.map((type) => (
                <ListGroup.Item
                    active = { type.id === contest.selectedType.id }
                    onClick={() => contest.setSelectedType(type)}
                    key={type.id}>
                    {type.name}
                </ListGroup.Item>
            ))}
        </ListGroup>
    );
};

export default observer(TypeBar);
import React, {useContext} from 'react';
import {observer} from 'mobx-react-lite';
import {Context} from "../main.jsx";
import {ListGroup} from "react-bootstrap";

const RewardsBar = () => {
    const {project} = useContext(Context);

    return (
        <ListGroup>
            {project.rewards.map((reward) => (
                <ListGroup.Item
                    active = { reward.id === project.selectedReward.id }
                    onClick={() => project.setSelectedReward(reward)}
                    key={reward.id}>
                    {reward.name}
                </ListGroup.Item>
            ))}
        </ListGroup>
    );
};

export default observer(RewardsBar);
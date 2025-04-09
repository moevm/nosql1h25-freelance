import React, {useContext} from 'react';
import {observer} from 'mobx-react-lite';
import {Context} from "../main.jsx";
import {ListGroup} from "react-bootstrap";

const RewardsBar = () => {
    const {contest} = useContext(Context);

    return (
        <ListGroup>
            {contest.rewards.map((reward) => (
                <ListGroup.Item
                    active = { reward.id === contest.selectedReward.id }
                    onClick={() => contest.setSelectedReward(reward)}
                    key={reward.id}>
                    {reward.name}
                </ListGroup.Item>
            ))}
        </ListGroup>
    );
};

export default observer(RewardsBar);
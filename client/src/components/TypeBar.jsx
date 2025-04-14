import React, {useContext, useState} from 'react';
import {observer} from "mobx-react-lite";
import {Context} from "../main.jsx";
import {InputGroup, ListGroup, Form, Dropdown} from "react-bootstrap";
import { BsTags } from 'react-icons/bs';

const TypeBar = () => {
    const { contest } = useContext(Context);

    const [selectedTypes, setSelectedTypes] = useState([]);

    const handleTypeSelect = (type) => {
        if (selectedTypes.includes(type)) {
            setSelectedTypes(selectedTypes.filter(t => t !== type));
        } else {
            setSelectedTypes([...selectedTypes, type]);
        }
    };

    return (
        <div style={{display: 'flex', alignItems: 'center', marginBottom: '1rem', marginTop: '1rem'}}>
            <div style={{
                padding: '0.375rem 0.75rem',
                backgroundColor: '#e9ecef',
                border: '1px solid #ced4da',
                borderRadius: '0.375rem 0 0 0.375rem'
            }}>
                <BsTags color='#543787'/>
            </div>
            <Dropdown style={{flex: 1}}>
                <Dropdown.Toggle
                    variant="outline-secondary"
                    style={{
                        width: '100%',
                        textAlign: 'left',
                        borderLeft: 'none',
                        borderRadius: '0 0.375rem 0.375rem 0'
                    }}
                >
                    Выбрано: {selectedTypes.length}
                </Dropdown.Toggle>
                <Dropdown.Menu style={{width: '100%'}}>
                    {contest?.types?.map((type) => (
                        <Dropdown.Item
                            key={type.id}
                            as="div"
                            onClick={(e) => {
                                e.stopPropagation();
                                handleTypeSelect(type);
                            }}
                        >
                            <Form.Check
                                type="checkbox"
                                label={type.name}
                                checked={selectedTypes.includes(type)}
                                onChange={() => handleTypeSelect(type)}
                            />
                        </Dropdown.Item>
                    ))}
                </Dropdown.Menu>
            </Dropdown>
        </div>
    );
};

export default observer(TypeBar);
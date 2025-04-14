import React, { useContext, useState } from 'react';
import { observer } from "mobx-react-lite";
import { Context } from "../main.jsx";
import { Dropdown, Form } from "react-bootstrap";
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
        <Dropdown style={{ width: '100%' }}>
            <Dropdown.Toggle
                as="div"
                id="dropdown-custom"
                style={{
                    display: 'flex',
                    alignItems: 'center',
                    width: '100%',
                    border: '1px solid #ced4da',
                    borderRadius: '0.375rem',
                    backgroundColor: '#fff',
                    cursor: 'pointer',
                    padding: '0.375rem 0.75rem',
                    userSelect: 'none'
                }}
            >
                <div style={{ marginRight: '0.5rem', display: 'flex', alignItems: 'center' }}>
                    <BsTags color='#543787' />
                </div>
                <div style={{ flex: 1 }}>
                    {selectedTypes.length === 0? "Выбор типов" : `Выбрано типов: ${selectedTypes.length}`}
                </div>
            </Dropdown.Toggle>

            <Dropdown.Menu style={{ width: '100%' }}>
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
                            style={{userSelect: 'none'}}
                        />
                    </Dropdown.Item>
                ))}
            </Dropdown.Menu>
        </Dropdown>
    );
};

export default observer(TypeBar);

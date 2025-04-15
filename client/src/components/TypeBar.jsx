import React, {useContext, useEffect, useState} from 'react';
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

    useEffect(() => {
        contest.fetchTypes();
    }, []);

    return (
        <Dropdown style={{width: '100%'}}>
            <div className="mt-2 mb-2">
                <BsTags color='#543787' />
                <span color='#543787' className="mx-1">Тип конкурса</span>
            </div>
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
                <div style={{flex: 1}}>
                    {selectedTypes.length === 0 ? "Все" : `Выбрано типов: ${selectedTypes.length}`}
                </div>
            </Dropdown.Toggle>

            <Dropdown.Menu style={{width: '100%', cursor: 'pointer'}}>
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
                            style={{
                                userSelect: 'none',
                                cursor: 'pointer'}}
                        />
                    </Dropdown.Item>
                ))}
            </Dropdown.Menu>
        </Dropdown>
    );
};

export default observer(TypeBar);

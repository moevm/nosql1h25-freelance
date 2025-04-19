import React, {useContext, useEffect, useState} from 'react';
import { Row, Col, Container, Button, Collapse, Card } from "react-bootstrap";
import ContestsList from "../components/ContestsList.jsx";
import { Context } from "../main.jsx";
import FiltersBar from "../components/FiltersBar.jsx";
import { BsFilter } from 'react-icons/bs'; // Иконка фильтра

const Contests = () => {
    const { contest, user } = useContext(Context);
    const [open, setOpen] = useState(false);

    useEffect(() => {
        if (user.user.id) {
            contest.setEmployerId(null);
            contest.setLoading(true);
        }
    }, [user]);

    return (
        <Container className="py-3">
            <div className="d-flex mb-2">
                <Button
                    onClick={() => setOpen(!open)}
                    aria-controls="filters-collapse"
                    aria-expanded={open}
                    style={{
                        backgroundColor: '#543787',
                        borderColor: '#543787',
                        color: 'white',
                        display: 'flex',
                        alignItems: 'center',
                        gap: '6px',
                        fontWeight: '500',
                        padding: '4px 10px',
                        borderRadius: '20px',
                        fontSize: '13px',
                        height: '32px',
                        lineHeight: '1'
                    }}
                    size="sm"
                >
                    <BsFilter size={14} />
                    {open ? 'Скрыть' : 'Фильтры'}
                </Button>
            </div>

            <Collapse in={open}>
                <div id="filters-collapse">
                    <Card className="mb-3 shadow-sm border-0">
                        <Card.Body className="py-3 px-3">
                            <FiltersBar />
                        </Card.Body>
                    </Card>
                </div>
            </Collapse>

            <Row>
                <Col>
                    <ContestsList />
                </Col>
            </Row>
        </Container>
    );
};

export default Contests;

import React, {useContext, useState} from 'react';
import { Row, Col, Container, Button, Collapse, Card } from "react-bootstrap";
import { BsFilter } from 'react-icons/bs';
import { observer } from 'mobx-react-lite';
import { Context } from "../main.jsx";
import SolutionsFiltersBar from './SolutionsFiltersBar.jsx';
import SolutionsList from './SolutionsList.jsx';

const SolutionListWithFilters = ({ showContestTitle, showFreelancerLogin }) => {
    const { solution } = useContext(Context);
    const [open, setOpen] = useState(false);

    const handleResetFilters = () => {
        solution.resetFilters();
    };

    return (
        <Container className="py-3">
            <div className="d-flex mb-2 gap-2">
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
                        fontSize: '16px',
                        height: '35px',
                        lineHeight: '1'
                    }}
                    size="sm"
                >
                    <BsFilter size={14} />
                    {open ? 'Скрыть' : 'Фильтры'}
                </Button>

                <Button
                    onClick={handleResetFilters}
                    variant="outline-secondary"
                    size="sm"
                    style={{
                        display: 'flex',
                        alignItems: 'center',
                        gap: '6px',
                        fontWeight: '500',
                        padding: '4px 10px',
                        borderRadius: '20px',
                        fontSize: '14px',
                        height: '35px',
                        lineHeight: '1',
                    }}
                >
                    Сбросить фильтры
                </Button>
            </div>

            <Collapse in={open}>
                <div id="filters-collapse">
                    <Card className="mb-3 shadow-sm border-0">
                        <Card.Body className="py-3 px-3">
                            <SolutionsFiltersBar />
                        </Card.Body>
                    </Card>
                </div>
            </Collapse>

            <Row>
                <Col>
                    <SolutionsList
                        showContestTitle={showContestTitle}
                        showFreelancerLogin={showFreelancerLogin}
                    />
                </Col>
            </Row>
        </Container>
    );
};

export default observer(SolutionListWithFilters);

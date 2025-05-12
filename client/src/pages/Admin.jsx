import React, { useState } from 'react';
import {Container} from "react-bootstrap";
import AddContestTypePanel from "../components/adminComponents/AddContestTypePanel.jsx";
import ImportExportPanel from "../components/adminComponents/ImportExportPanel.jsx";

const Admin = () => {

    return (
        <Container className="mt-4">
            <AddContestTypePanel />
            <ImportExportPanel />
        </Container>
    );
};

export default Admin;
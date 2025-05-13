import React, { useRef, useState } from 'react';
import { Button } from "react-bootstrap";
import { importData, exportData} from "./importExportService.js";

const ImportExportPanel = () => {
    const fileInputRef = useRef(null);
    const [importStatus, setImportStatus] = useState(null);
    const [isImporting, setIsImporting] = useState(false);
    const [isExporting, setIsExporting] = useState(false);

    const handleExport = async () => {
        setIsExporting(true);
        try {
            await exportData();
            setImportStatus("Экспорт завершён успешно");
        } catch (error) {
            setImportStatus("Ошибка при экспорте данных");
        } finally {
            setIsExporting(false);
        }
    };

    const handleImportClick = () => {
        fileInputRef.current.click();
    };

    const handleImport = async (e) => {
        const file = e.target.files[0];
        if (!file) return;

        setIsImporting(true);
        try {
            await importData(file);
            setImportStatus("Импорт завершён успешно");
        } catch (error) {
            setImportStatus("Ошибка при импорте данных");
        } finally {
            setIsImporting(false);
            e.target.value = ''; // Сброс input
        }
    };

    return (
        <div className="max-w-md mx-auto bg-white p-4 rounded border shadow-sm">
            <h2 className="text-center mb-4">Импорт / Экспорт данных</h2>

            <div className="d-grid gap-3">
                <Button onClick={handleExport} disabled={isExporting}>
                    {isExporting ? 'Экспорт...' : 'Экспортировать'}
                </Button>

                <Button variant="secondary" onClick={handleImportClick} disabled={isImporting}>
                    {isImporting ? 'Импорт...' : 'Импортировать'}
                </Button>

                <input
                    ref={fileInputRef}
                    type="file"
                    accept="application/json"
                    onChange={handleImport}
                    style={{ display: 'none' }}
                />

                {importStatus && (
                    <p className="text-center text-muted small">{importStatus}</p>
                )}
            </div>
        </div>
    );
};

export default ImportExportPanel;

import { fetchData, sendData} from "../../services/apiService.js";

// Экспорт всех данных
export const exportData = async () => {

};

// Импорт данных из файла
export const importData = async (file) => {
    try {
        const formData = new FormData();
        formData.append('file', file);

        const response = await sendData('/import-export/import', formData, true);
        console.log("Импорт завершён успешно", response);
        return response;
    } catch (error) {
        console.error("Ошибка при импорте данных:", error);
        throw error;
    }
};

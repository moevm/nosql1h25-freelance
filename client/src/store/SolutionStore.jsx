import { makeAutoObservable } from "mobx";
import { fetchData, deleteData, updateData } from "../services/apiService";


const baseForm = {
    description: {
        value: '',
        error: '',
        rules: { min: 100, max: 20000 },
    },
    files: {
        error: '',
        rules: { max: 20 },
        allowedTypes: ['application/zip', 'application/x-zip-compressed', 'image/png', 'image/jpeg', 'image/jpg', 'image/gif'],
    }
};

export default class SolutionStore {
    solutions = [];
    currentSolution = null;
    form = baseForm;

    formErrors = {
        description: `Описание решения от ${this.form.description.rules.min} до ${this.form.description.rules.max} символов`,
        files: `Максимальное количество файлов - ${this.form.files.rules.max}`
    };

    statusMap = {
        1: { label: 'Новое', color: '#87cefa', textColor: '#000' },       // Голубой
        2: { label: 'Просмотрено', color: '#99ff99', textColor: '#000' },  // Салатовый
        3: { label: 'Победитель', color: '#008000', textColor: '#000' },   // Зеленый
        4: { label: 'Необходимы правки', color: '#f3a505', textColor: '#000' }, // Желтый
        5: { label: 'Правки внесены', color: '#87cefa', textColor: '#000' },    // Синий
    };

    constructor() {
        makeAutoObservable(this);
    }

    setSolutions(solutions) {
        this.solutions = solutions;
    }

    setCurrentSolution(solution) {
        this.currentSolution = solution;
    }

    setFormField(field, value) {
        this.form[field].value = value;
        this.validateField(field);
    }

    resetForm() {
        this.form = baseForm;
    }

    validateField(field) {
        switch (field) {
            case 'description':
                this.form.description.error = !(
                    this.form.description.value.length >= this.form.description.rules.min &&
                    this.form.description.value.length <= this.form.description.rules.max
                ) ? this.formErrors.description : '';
                break;
        }
    }

    validateForm() {
        Object.keys(this.form).forEach(field => this.validateField(field));
        return !Object.values(this.form).some(field => field.error !== '');
    }

    getStatus(number) {
        return this.statusMap[number] || { label: 'Неизвестно', color: 'dark' };
    }

    async fetchSolutionsByContestId(contestId) {
        try {
            const solutions = await fetchData(`/solutions/contest/${contestId}`);
            this.setSolutions(solutions);
        } catch (error) {
            console.error("Ошибка при загрузке решений:", error);
            this.setSolutions([]);
        }
    }

    async fetchSolutionsByFreelancerId(freelancerId) {
        try {
            const solutions = await fetchData(`/solutions/user/${freelancerId}`);
            this.setSolutions(solutions);
        } catch (error) {
            console.error("Ошибка загрузки решений фрилансера:", error);
            this.setSolutions([]);
        }
    }

    async fetchSolutionByNumber(number) {
        try {
            const solution = await fetchData(`/solutions/number/${number}`);
            this.setCurrentSolution(solution);
            return solution;
        } catch (error) {
            console.error("Ошибка загрузки решения:", error);
            return null;
        }
    }

    // Добавляем метод для проверки существующего решения
    getSolutionIfExists(number) {
        if (this.currentSolution && this.currentSolution.number == number) {
            return this.currentSolution;
        }
        return null;
    }

    async deleteSolutionById(solutionId) {
        try {
            await deleteData(`/solutions/${solutionId}`);
            this.setCurrentSolution(null); // Очищаем текущее решение
            return true;
        } catch (error) {
            console.error("Ошибка при удалении решения:", error);
            throw error;
        }
    }

    async updateSolutionStatus(solutionId, newStatus) {
        try {
            // Проверка типа статуса
            if (typeof newStatus !== 'number' || newStatus < 1 || newStatus > 5) {
                throw new Error('Статус должен быть числом от 1 до 5');
            }
    
            const response = await updateData(`/solutions/${solutionId}`, {
                status: newStatus
            });
    
            // Обновляем локальное состояние
            this._updateLocalSolution(response);
            return response;
        } catch (error) {
            console.error('Ошибка обновления статуса:', error);
            throw error;
        }
    }
    
    _updateLocalSolution(updatedSolution) {
        // Обновляем в списке решений
        const index = this.solutions.findIndex(s => s.id === updatedSolution.id);
        if (index !== -1) {
            this.solutions[index] = updatedSolution;
        }
    
        // Обновляем текущее решение
        if (this.currentSolution?.id === updatedSolution.id) {
            this.currentSolution = updatedSolution;
        }
    }
}

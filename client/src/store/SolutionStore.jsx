import { makeAutoObservable } from "mobx";
import { fetchData } from "../services/apiService";


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
    form = baseForm;

    formErrors = {
        description: `Описание решения от ${this.form.description.rules.min} до ${this.form.description.rules.max} символов`,
        files: `Максимальное количество файлов - ${this.form.files.rules.max}`
    };

    statusMap = {
        1: { label: 'Новое', color: 'secondary' },
        2: { label: 'Просмотрено', color: 'primary' },
        3: { label: 'Победитель', color: 'success' },
        4: { label: 'Необходимы правки', color: 'warning' },
        5: { label: 'Правки внесены', color: 'info' },
    };

    constructor() {
        makeAutoObservable(this);
    }

    setSolutions(solutions) {
        this.solutions = solutions;
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
}

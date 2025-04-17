import { makeAutoObservable } from "mobx";
import { fetchData } from "../services/apiService";

const baseForm = {
    type: {
        value: null,
        error: '',
        rules: {},
    },
    title: {
        value: '',
        error: '',
        rules: {min: 10, max: 100 },
    },
    annotation: {
        value: '',
        error: '',
        rules: {min: 30, max: 200 },
    },
    description: {
        value: '',
        error: '',
        rules: {min: 100, max: 20000 },
    },
    prizepool: {
        value: '',
        error: '',
        rules: {min: 0, max: 9999999 },
    },
    endBy: {
        value: '',
        error: '',
        rules: { minDays: 3 },
    },
    files: {
        error: '',
        rules: { max: 20 }
    }
};

export default class ContestStore {
    form = baseForm;

    formErrors = {
        type: 'Тип конкурса обязателен',
        title: `Название должно быть от ${this.form.title.rules.min} до ${this.form.title.rules.max} символов`,
        annotation: `Краткое описание от ${this.form.annotation.rules.min} до ${this.form.annotation.rules.max} символов`,
        description: `Полное описание от ${this.form.description.rules.min} до ${this.form.description.rules.max} символов`,
        prizepool: `Приз должен быть от ${this.form.prizepool.rules.min} до ${this.form.prizepool.rules.max}`,
        endBy: `Дата окончания минимум на ${this.form.endBy.rules.minDays} дня позже текущей`,
        files: `Максимальное количество файлов - ${this.form.files.rules.max}`
    };
    
    constructor() {
        this._isAuth = false;
        this._types = [];
        this._contests = [];
        this._selectedType = {}
        this._minReward = 0;
        this._maxReward = 9999999;
        makeAutoObservable(this);
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
            case 'title':
                this.form.title.error = !(this.form.title.value.length >= this.form.title.rules.min &&
                    this.form.title.value.length <= this.form.title.rules.max)
                    ? this.formErrors.title : '';
                break;
            case 'annotation':
                this.form.annotation.error = !(this.form.annotation.value.length >= this.form.annotation.rules.min &&
                    this.form.annotation.value.length <= this.form.annotation.rules.max)
                    ? this.formErrors.annotation : '';
                break;
            case 'description':
                this.form.description.error = !(this.form.description.value.length >= this.form.description.rules.min &&
                    this.form.description.value.length <= this.form.description.rules.max)
                    ? this.formErrors.description : '';
                break;
            case 'prizepool':
                const value = parseInt(this.form.prizepool.value);
                this.form.prizepool.error = !(value >= this.form.prizepool.rules.min && 
                    value <= this.form.prizepool.rules.max) 
                    ? this.formErrors.prizepool : '';
                break;
            case 'endBy':
                let selectedDate = new Date(this.form.endBy.value);
                if (!this.form.endBy.value) selectedDate = new Date('1970-01-01')
                let minValidDate = new Date();
                minValidDate.setDate(minValidDate.getDate() + 3);
                if (selectedDate < minValidDate) {
                    this.form.endBy.error = this.formErrors.endBy;
                } else {
                    this.form.endBy.error = '';
                    this.form.endBy.value = selectedDate.toISOString().split('T')[0];
                }
                break;
            case 'type':
                this.form.type.error = this.form.type.value ? '' : this.formErrors.type;
                break;
        }
    }

    validateForm() {
        Object.keys(this.form).forEach(field => this.validateField(field));
        return !Object.values(this.form).some(field => field.error !== '');
    }

    setIsAuth(bool) {
        this._isAuth = bool;
    }

    setTypes(types) {
        this._types = types;
    }

    setContests(contest) {
        this._contests = contest;
    }

    setSelectedType(type) {
        this._selectedType = type;
    }

    setMinReward(min) {
        this._minReward = min;
    }

    setMaxReward(max) {
        this._maxReward = max;
    }

    setReward({ min, max }) {
        this.setMinReward(min);
        this.setMaxReward(max);
    }

    get minReward() {
        return this._minReward;
    }

    get maxReward() {
        return this._maxReward;
    }

    get isAuth() {
        return this._isAuth;
    }

    get types() {
        return this._types;
    }

    get contests() {
        return this._contests;
    }

    get selectedType() {
        return this._selectedType;
    }

    get reward(){
        return this._reward;
    }

    async fetchContests() {
        try {
            const contests = await fetchData("/contests");
            this.setContests(contests);
        } catch (error) {
            console.error("Ошибка при отправке:", error);
        }
    }

    async fetchTypes() {
        try {
            const types = await fetchData("/contest-types");
            this.setTypes(types);
        } catch (error) {
            console.error("Ошибка при загрузке типов конкурсов:", error);
        }
    }

    getTypeNameById(typeId) {
        if (!typeId) return null;
        const type = this._types.find(t => t._id === typeId || t.id === typeId);
        return type?.name || "Неизвестный тип";
    }
}
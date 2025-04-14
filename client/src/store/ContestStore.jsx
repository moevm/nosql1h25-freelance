import {makeAutoObservable} from "mobx";
import { fetchData } from "../services/apiService";

export default class ContestStore {
    constructor() {
        this._isAuth = false;
        this._types = [
            {id: 1, name: "Программирование"},
            {id: 2, name: "Дизайн"},
            {id: 3, name: "Иллюстрации"},
            {id: 4, name: "Нейминг"},
            {id: 5, name: "Моделирование"}
        ];
        this._contests = [

        ];
        this._selectedType = {}
        this._minReward = 0;
        this._maxReward = 10000000;
        makeAutoObservable(this);
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

    getTypeNameById(typeId) {
        const type = this._types.find(t => t.id === typeId);
        return type ? type.name : null;  // возвращает название типа или null, если не найден
    }
}
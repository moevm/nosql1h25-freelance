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
        this._rewards = [
            {id: 1, name: "10000"},
            {id: 2, name: "15000"},
            {id: 3, name: "30000"},
        ]
        this._selectedReward = {}
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

    setRewards(rewards) {
        this._rewards = rewards;
    }

    setSelectedReward(reward) {
        this._selectedReward = reward;
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

    get rewards(){
        return this._rewards;
    }

    get selectedReward() {
        return this._selectedReward;
    }

    async fetchContests() {
        try {
            const contests = await fetchData("/contests");
            this.setContests(contests);
        } catch (error) {
            console.error("Ошибка при отправке:", error);
        }
    }
}
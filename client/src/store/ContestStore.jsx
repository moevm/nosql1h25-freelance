import {makeAutoObservable} from "mobx";
import { fetchData } from "../services/apiService";

export default class ContestStore {
    constructor() {
        this._isAuth = false;
        this._types = [];
        this._contests = [];
        this._selectedContest = null;
        this._selectedType = {}
        this._minReward = 0;
        this._maxReward = 9999999;
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

    setSelectedContest(contest) {
        this.selectedContest = contest;
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

    async fetchOneContest(id) {
        try {
            const contest = await fetchData(`/contests/${id}`);
            return contest;
        } catch (error) {
            console.error("Ошибка при загрузке конкурса:", error);
            return null;
        }
    }

    getTypeNameById(typeId) {
        if (!typeId) return null;
        const type = this._types.find(t => t._id === typeId || t.id === typeId);
        return type?.name || "Неизвестный тип";
    }
}
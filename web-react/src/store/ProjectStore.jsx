import {makeAutoObservable} from "mobx";

export default class ProjectStore {
    constructor() {
        this._isAuth = false;
        this._types = [
            {id: 1, name: "Программирование"},
            {id: 2, name: "Дизайн"},
            {id: 3, name: "Иллюстрации"},
            {id: 4, name: "Нейминг"},
            {id: 5, name: "Моделирование"}
        ];
        this._projects = [
            {id: 1, name: "Сверстайте сайт", rating: 4},
            {id: 2, name: "Нарисуйте дерево", rating: 5}
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

    setProjects(projects) {
        this._projects = projects;
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

    get projects() {
        return this._projects;
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
}
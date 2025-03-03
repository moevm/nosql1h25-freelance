import {makeAutoObservable} from "mobx";

export default class ProjectStore {
    constructor() {
        this._isAuth = false;
        this._types = [
            {id: 1, name: "Программирование"},
            {id: 2 , name: "Дизайн"}
        ]
        this._projects = [
            {id: 1, name: "Сверстайте сайт", rating: 4},
            {id: 2, name: "Нарисуйте дерево", rating: 5}
        ]
        makeAutoObservable(this);
    }

    setIsAuth(bool) {
        return this._isAuth;
    }
    setTypes(types) {
        return this._types;
    }
    setProjects(projects) {
        return this._projects;
    }

    get IsAuth() {
        this._isAuth = bool;
    }
    get Types() {
        this._types = types;
    }
    get Projects() {
        this._projects = projects;
    }
}
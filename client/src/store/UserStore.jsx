import { makeAutoObservable } from "mobx";
import { fetchData } from "../services/apiService";


export default class UserStore {
    constructor() {
        this._isAuth = false;
        this._user = {};
        this._users = {}; // Хранилище пользователей по ID
        this.loadFromLocalStorage();
        makeAutoObservable(this);
    }

    loadFromLocalStorage() {
        const storedUser = localStorage.getItem("user");
        const storedIsAuth = localStorage.getItem("isAuth");
        if (storedUser) this._user = JSON.parse(storedUser);
        if (storedIsAuth) this._isAuth = JSON.parse(storedIsAuth);
    }

    setIsAuth(bool) {
        this._isAuth = bool;
        localStorage.setItem("isAuth", JSON.stringify(bool));
    }

    setUser(user) {
        this._user = user;
        localStorage.setItem("user", JSON.stringify(user));
    }

    get isAuth() {
        return this._isAuth;
    }

    get user() {
        return this._user;
    }

    setUserById(user) {
        this._users[user.id] = user;
    }

    getById(id) {
        return this._users[id] || null;
    }

    async fetchUserById(id) {
        try {
            const user = await fetchData(`/users/${id}`);
            this.setUserById(user);
        } catch (error) {
            console.error("Ошибка загрузки пользователя:", error);
        }
    }
}

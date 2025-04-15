import {makeAutoObservable} from "mobx";

export default class UserStore {


    constructor() {
        const storedUser = localStorage.getItem("user");
        const storedIsAuth = localStorage.getItem("isAuth");

        this._isAuth = storedIsAuth ? JSON.parse(storedIsAuth) : false;
        this._user = storedUser ? JSON.parse(storedUser) : {};

        makeAutoObservable(this);
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
}
const firebase = require("nativescript-plugin-firebase");
import { Injectable } from "@angular/core";
import { RouterExtensions } from "nativescript-angular/router";

@Injectable({
    providedIn: "root"
})
export class AuthService {

    constructor(private router: RouterExtensions) {
        if (!firebase.initialized) {
            firebase.init({
                onAuthStateChanged(data) {
                    console.log(data.loggedIn ? "Logged in to firebase" : "Logged out from firebase");
                    if (data.loggedIn) {
                        console.log("user's email address: " + (data.user.email ? data.user.email : "N/A"));
                    }
                }
            });
        }
    }
    registerGoogle() {
        return firebase.login({
            type: firebase.LoginType.GOOGLE
        }).then((result) => {
            return result;
        },
            (errorMessage) => {
                console.log(errorMessage);
            }
        );
    }

    loginGoogle() {
        firebase.login({
            type: firebase.LoginType.GOOGLE
        }).then((result) => {
            this.router.navigateByUrl("/home");
        },
            (errorMessage) => {
                console.log(errorMessage);
            }
        );
    }
    getCurrentUser() {
        return firebase.getCurrentUser();
    }
    logout() {
        firebase.logout().then(() => this.redirect("landing"));
    }
    redirect(page) {
        this.router.navigateByUrl("/" + page);
    }

    getFirebase() {
        return firebase;
    }

}

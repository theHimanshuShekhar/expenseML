const firebase = require("nativescript-plugin-firebase");
import { Injectable } from "@angular/core";
import { RouterExtensions } from "nativescript-angular/router";

@Injectable({
    providedIn: "root"
})
export class AuthService {

    constructor(private router: RouterExtensions) { }

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
    logout() {
        firebase.logout().then(() => this.redirect("landing"));
    }
    redirect(page) {
        this.router.navigateByUrl("/" + page);
    }

}

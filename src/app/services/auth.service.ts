const firebase = require("nativescript-plugin-firebase");
import { Injectable } from "@angular/core";

@Injectable({
    providedIn: "root"
})
export class AuthService {

    constructor() {
        console.log("auth service");
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

    loginGoogle() {
        firebase.login({
            type: firebase.LoginType.GOOGLE
            // Optional
            // googleOptions: {
            //     hostedDomain: "mygsuitedomain.com"
            // }
        }).then((result) => {
            JSON.stringify(result);
        },
            (errorMessage) => {
                console.log(errorMessage);
            }
        );
    }

    getFirebase() {
        return firebase;
    }

}
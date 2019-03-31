const firebase = require("nativescript-plugin-firebase");
import { Injectable } from "@angular/core";

@Injectable({
    providedIn: "root"
})
export class FirebaseService {
    data;

    constructor() {
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

    getCurrentUser() {
        return firebase.getCurrentUser();
    }
}

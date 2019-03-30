const firebase = require("nativescript-plugin-firebase");
import { Injectable } from "@angular/core";

@Injectable({
    providedIn: "root"
})
export class DataService {
    data;

    constructor() {
        if (!firebase.initialized) {
            firebase.init({
                onAuthStateChanged(data) {
                    this.data = data;
                    console.log(data.loggedIn ? "Logged in to firebase" : "Logged out from firebase");
                    if (data.loggedIn) {
                        console.log("user's email address: " + (data.user.email ? data.user.email : "N/A"));
                    }
                }
            });
        }
    }

    getFirebase() {
        return firebase;
    }
    getDateReports(uid, date) {
        const data = [
            {
                category: "Transport",
                value: "55",
                desc: "Auto fare"
            },
            {
                category: "Transport",
                value: "15",
                desc: "Bus Ticket"
            },
            {
                category: "Food",
                value: "20",
                desc: "Lunch"
            },
            {
                category: "Bills",
                value: "1200",
                desc: "Internet"
            },
            {
                category: "Misc",
                value: "45",
                desc: "Stationary"
            }];
        shuffleArray(data);

        return data;
    }
}

function shuffleArray(array) {
    for (let i = array.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [array[i], array[j]] = [array[j], array[i]];
    }
}

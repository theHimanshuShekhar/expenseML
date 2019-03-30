import { Injectable } from "@angular/core";

@Injectable({
    providedIn: "root"
})
export class DataService {
    data = [
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
        }
    ];
    constructor() { }

    getDateReports(uid, date) {
        shuffleArray(this.data);
        return this.data;
    }
}
function shuffleArray(array) {
    for (let i = array.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [array[i], array[j]] = [array[j], array[i]];
    }
}

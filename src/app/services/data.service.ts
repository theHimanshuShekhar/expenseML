import { Injectable } from "@angular/core";

@Injectable({
    providedIn: "root"
})
export class DataService {
    constructor() {}

    getDateReports(uid, date) {
        return [
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
    }
}

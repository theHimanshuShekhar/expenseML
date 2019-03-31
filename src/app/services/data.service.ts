import { Injectable } from "@angular/core";
import { firestore } from "nativescript-plugin-firebase";
import { FirebaseService } from "./firebase.service";
import { RouterExtensions } from "nativescript-angular/router";
import { isDate } from "@angular/common/src/i18n/format_date";

@Injectable({
    providedIn: "root"
})
export class DataService {
    data;

    constructor(
        private firebaseService: FirebaseService,
        private routerExtention: RouterExtensions
    ) { }

    // getDateEntries(date) {
    //     return
    // }


    //     const recordcollection = .collection("records")
    //     .doc(date).collection("records");

    // return recordcollection.onSnapshot((snapshot) => {
    //     let records = {};
    //     snapshot.forEach((doc) => {
    //         records = { ...doc.data() };
    //     });

    //     return records;
    // });

    addEntry(data) {
        this.firebaseService.getCurrentUser()
            .then((user) => {
                const datedoc = firestore.collection("users").doc(user.uid)
                    .collection("records").doc(this.getDateString(data.date));
                datedoc.set({
                    date: this.getDateString(data.date),
                    estimate: null
                })
                    .then(() => {
                        console.log("Date doc created");
                        const record = datedoc.collection("records").doc();
                        data = { eid: record.id, ...data };
                        record.set(data).then(() => console.log("record added"))
                            .then(() => {
                                this.routerExtention.back();
                            })
                            .catch((err) => console.log(err));
                    })
                    .catch((err) => console.log(err));
            })
            .catch((err) => console.log(err));
    }

    updateEntry(data) {
        // Update existing record
    }
    getDateString(date) {
        const thedate = new Date(date);

        return thedate.getDate() + "_" + thedate.getMonth() + "_" + thedate.getFullYear();
    }

}


function shuffleArray(array) {
    for (let i = array.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [array[i], array[j]] = [array[j], array[i]];
    }
}

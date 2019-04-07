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
    updateEntry(data) {
        this.firebaseService.getCurrentUser().then((user) => {
            firestore.collection("users").doc(user.uid)
                .collection("daily").doc(this.getDateString(data.date))
                .collection("entries").doc(data.eid).update(data).then(() =>
                    this.routerExtention.back());
        });
    }

    addEntry(data) {
        this.firebaseService.getCurrentUser()
            .then((user) => {
                const datedoc = firestore.collection("users").doc(user.uid)
                    .collection("daily").doc(this.getDateString(data.date));
                datedoc.set({
                    rid: this.getDateString(data.date),
                    date: data.date,
                    estimate: 0,
                    foodandgroceries: 0,
                    transport: 0,
                    bills: 0,
                    healthcare: 0,
                    entertainment: 0,
                    misc: 0
                })
                    .then(() => {
                        console.log("Date doc created");
                        const record = datedoc.collection("entries").doc();
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

    getDateString(date) {
        const thedate = new Date(date);

        return thedate.getDate() + "_" + thedate.getMonth() + "_" + thedate.getFullYear();
    }

}

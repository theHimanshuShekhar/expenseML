import { Component, OnInit } from "@angular/core";
import { RadSideDrawer } from "nativescript-ui-sidedrawer";
import * as app from "tns-core-modules/application";
import { DataService } from "../services/data.service";
import { FirebaseService } from "../services/firebase.service";
import { firestore } from "nativescript-plugin-firebase";

@Component({
    selector: "Browse",
    moduleId: module.id,
    styleUrls: ["./browse.component.scss"],
    templateUrl: "./browse.component.html"
})
export class BrowseComponent implements OnInit {

    user;
    monthlydata;
    constructor(
        private dataService: DataService,
        private firebaseService: FirebaseService
    ) {
        // Use the component constructor to inject providers.
    }

    ngOnInit(): void {
        // Init your component properties here.
        this.dataService.getUserMonthly().then((data) => {
            this.monthlydata = data;
            console.log(data);
        });
        this.firebaseService.getCurrentUser().then((user) => {
            firestore.collection("users").doc(user.uid).get()
            .then((userdoc) => this.user = userdoc.data())
            .catch((err) => console.log(err));
        });
    }

    onDrawerButtonTap(): void {
        const sideDrawer = <RadSideDrawer>app.getRootView();
        sideDrawer.showDrawer();
    }
    getTotal(month) {
        return month.entertainment + month.foodandgroceries + month.bills + month.transport + month.healthcare + month.misc;
    }
}

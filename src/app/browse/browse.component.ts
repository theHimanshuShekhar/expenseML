import { Component, OnInit } from "@angular/core";
import { RadSideDrawer } from "nativescript-ui-sidedrawer";
import * as app from "tns-core-modules/application";
import { DataService } from "../services/data.service";
import { FirebaseService } from "../services/firebase.service";
import { firestore } from "nativescript-plugin-firebase";
import { SelectedIndexChangedEventData } from "nativescript-drop-down";

@Component({
    selector: "Browse",
    moduleId: module.id,
    styleUrls: ["./browse.component.scss"],
    templateUrl: "./browse.component.html",
})
export class BrowseComponent implements OnInit {

    user;
    monthlydata;
    selectedMonth;
    selectedIndex;
    months = [];
    pieData;
    i = 0;
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
            this.monthlydata.forEach((monthdata) => {
                this.months.push(monthdata.month);
            });
            this.selectedMonth = this.monthlydata[0];
            this.getPieData();
            this.selectedIndex = 0;
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
        return month.entertainment + month.foodandgroceries
            + month.bills + month.transport + month.healthcare + month.misc;
    }

    onMonthChange(args: SelectedIndexChangedEventData) {
        this.selectedIndex = args.newIndex;
        this.selectedMonth = this.monthlydata[args.newIndex];
        this.getPieData();
    }
    getPieData() {
        this.pieData = [
            { key: "Entertainment", value: this.selectedMonth.entertainment },
            { key: "Food", value: this.selectedMonth.foodandgroceries },
            { key: "Bills", value: this.selectedMonth.bills },
            { key: "Transport", value: this.selectedMonth.transport },
            { key: "Healthcare", value: this.selectedMonth.healthcare },
            { key: "Misc", value: this.selectedMonth.misc }
        ];
    }

    getRow() {
        const i = this.i;
        this.i++;
        switch (i) {
            case 1:
                return 0;
            case 2:
                return 0;
            case 3:
                return 1;
            case 4:
                return 1;

            case 5:
                return 2;
            case 6:
                return 2;
        }
    }
}

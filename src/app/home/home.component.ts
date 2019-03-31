import { Component, OnInit, NgZone } from "@angular/core";
import { RadSideDrawer } from "nativescript-ui-sidedrawer";
import * as app from "tns-core-modules/application";
import { DataService } from "../services/data.service";
import { AuthService } from "../services/auth.service";
import { registerElement } from "nativescript-angular/element-registry";
import { RouterExtensions } from "nativescript-angular/router";
import { FirebaseService } from "../services/firebase.service";
import { firestore } from "nativescript-plugin-firebase";
registerElement("Fab", () => require("nativescript-floatingactionbutton").Fab);

@Component({
    selector: "Home",
    moduleId: module.id,
    templateUrl: "./home.component.html",
    styleUrls: ["./home.component.scss"]
})
export class HomeComponent implements OnInit {
    currDate;
    dispDate;
    entries = [];
    user;
    constructor(
        private firebaseService: FirebaseService,
        private dataService: DataService,
        private auth: AuthService,
        private zone: NgZone,
        private router: RouterExtensions) {
        // Use the component constructor to inject providers.
    }

    ngOnInit(): void {
        // Init your component properties here.
        this.firebaseService.getCurrentUser().then((user) => {
            if (user) {
                this.user = user;
                this.currDate = new Date();
                this.onDateNav();
            }
        }).catch(() => {
            this.auth.redirect("landing");
        });
    }

    getEntries() {

        this.entries = [];
        this.firebaseService.getCurrentUser()
            .then((user) => {

                return firestore.collection("users").doc(user.uid).collection("records")
                    .doc(this.dataService.getDateString(this.currDate)).collection("records")
                    .onSnapshot((snapshot) => {
                        this.zone.run(() => {
                            this.entries = [];
                            snapshot.forEach((record) => this.entries.push(record.data()));
                        });
                    });
            });
    }
    onDrawerButtonTap(): void {
        const sideDrawer = <RadSideDrawer>app.getRootView();
        sideDrawer.showDrawer();
    }

    onDateNav(type?) {
        if (type === "right") {
            this.currDate.setDate(this.currDate.getDate() + 1);
        }
        if (type === "left") {
            this.currDate.setDate(this.currDate.getDate() - 1);
        }
        this.dispDate = this.currDate.toDateString();

        this.getEntries();
    }

    addEntry() {
        this.router.navigate(["editentry"], {
            queryParams: {
                "date": this.currDate
            }
        });
    }
}

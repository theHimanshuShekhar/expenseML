import { Component, OnInit } from "@angular/core";
import { RadSideDrawer } from "nativescript-ui-sidedrawer";
import * as app from "tns-core-modules/application";
import { DataService } from "../services/data.service";
import { AuthService } from "../services/auth.service";
import { registerElement } from "nativescript-angular/element-registry";
import { RouterExtensions } from "nativescript-angular/router";
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
    reports;
    user;
    constructor(
        private dataService: DataService,
        private auth: AuthService,
        private router: RouterExtensions) {
        // Use the component constructor to inject providers.
    }

    ngOnInit(): void {
        // Init your component properties here.
        this.auth.getCurrentUser().then((user) => {
            if (user) {
                this.user = user;
            }
        }).catch(() => {
            this.auth.redirect("landing");
        });
        this.currDate = new Date();
        this.onDateNav();
        this.getReports();
    }

    getReports() {
        this.reports = this.dataService.getDateReports("uid", this.currDate);
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
        this.getReports();
    }
    addEntry() {
        this.router.navigate(["editentry"], {
            queryParams: {
                "date": this.currDate
            }
        });
    }
}

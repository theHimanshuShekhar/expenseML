import { Component, OnInit, NgZone } from "@angular/core";
import { RadSideDrawer } from "nativescript-ui-sidedrawer";
import * as app from "tns-core-modules/application";
import * as dialogs from "tns-core-modules/ui/dialogs";
import { DataService } from "../services/data.service";
@Component({
    selector: "Home",
    moduleId: module.id,
    templateUrl: "./home.component.html",
    styleUrls: ["./home.component.scss"]
})
export class HomeComponent implements OnInit {
    currDate;
    reports;
    constructor(private dataService: DataService, private ngzone: NgZone) {
        // Use the component constructor to inject providers.
    }

    ngOnInit(): void {
        // Init your component properties here.
        this.updateStatusBar();
        this.currDate = new Date();
        this.getReports();
    }

    updateStatusBar() {}
    getReports() {
        this.reports = this.dataService.getDateReports("uid", this.currDate);
    }
    onDrawerButtonTap(): void {
        const sideDrawer = <RadSideDrawer>app.getRootView();
        sideDrawer.showDrawer();
    }

    onDateNav(type): void {
        this.ngzone.run(() => this.changeDate(type));
        dialogs.alert({
            title: "clicked " + type,
            message: this.currDate.toDateString(),
            okButtonText: "close"
        });
    }
    changeDate(type) {
        if (type === "right") {
            this.currDate.setDate(this.currDate.getDate() + 1);
        }
        if (type === "left") {
            this.currDate.setDate(this.currDate.getDate() - 1);
        }

        return this.currDate;
    }
}

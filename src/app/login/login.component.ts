import { Component, OnInit } from "@angular/core";
import { EventData, Page } from "tns-core-modules/ui/page/page";

@Component({
    selector: "ns-login",
    templateUrl: "./login.component.html",
    styleUrls: ["./login.component.scss"],
    moduleId: module.id
})
export class LoginComponent implements OnInit {
    constructor(private page: Page) {}

    ngOnInit() {
        this.page.actionBarHidden = true;
    }
}

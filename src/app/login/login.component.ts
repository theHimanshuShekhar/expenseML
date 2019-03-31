import { Component, OnInit } from "@angular/core";
import { EventData, Page } from "tns-core-modules/ui/page/page";
import { AuthService } from "../services/auth.service";
import { RouterExtensions } from "nativescript-angular/router";

@Component({
    selector: "ns-login",
    templateUrl: "./login.component.html",
    styleUrls: ["./login.component.scss"],
    moduleId: module.id
})
export class LoginComponent implements OnInit {
    message;
    constructor(
        private page: Page,
        private auth: AuthService,
        private router: RouterExtensions) { }

    ngOnInit() {
        this.page.actionBarHidden = true;
    }

    googleLogin() {
        this.auth.loginGoogle().then((message) => this.message = message);
    }
}

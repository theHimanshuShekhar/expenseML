import { Component, OnInit } from "@angular/core";
import { NavigationEnd, Router } from "@angular/router";
import { DrawerTransitionBase, RadSideDrawer, SlideInOnTopTransition } from "nativescript-ui-sidedrawer";
import { filter } from "rxjs/operators";
import * as app from "tns-core-modules/application";
import { AuthService } from "./services/auth.service";
import { RouterExtensions } from "nativescript-angular/router";
import { FirebaseService } from "./services/firebase.service";

@Component({
    moduleId: module.id,
    selector: "ns-app",
    templateUrl: "app.component.html"
})
export class AppComponent implements OnInit {
    private _activatedUrl: string;
    private _sideDrawerTransition: DrawerTransitionBase;

    email;
    username;

    gestures = true;

    constructor(
        private firebaseService: FirebaseService,
        private router: Router,
        private routerExtensions: RouterExtensions,
        private auth: AuthService) {
        // Use the component constructor to inject services.
    }

    ngOnInit(): void {
        this._activatedUrl = "/home";
        this._sideDrawerTransition = new SlideInOnTopTransition();

        this.getCurrentUser();

        this.router.events
            .pipe(filter((event: any) => event instanceof NavigationEnd))
            .subscribe((event: NavigationEnd) => {
                this._activatedUrl = event.urlAfterRedirects;
                if (this._activatedUrl == "/login"
                    || this._activatedUrl == "/landing" || this._activatedUrl == "/register") {
                    this.gestures = false;
                } else {
                    this.gestures = true;
                }
            });
    }

    getCurrentUser() {
        this.firebaseService.getCurrentUser().then((user) => {
            this.email = user.email;
            this.username = user.name;
        }).catch(() => {
            this.auth.redirect("landing");
        });
    }

    get sideDrawerTransition(): DrawerTransitionBase {

        return this._sideDrawerTransition;
    }
    onDrawerOpening(args) {
        this.getCurrentUser();
    }
    isComponentSelected(url: string): boolean {
        return this._activatedUrl === url;
    }

    onNavItemTap(navItemRoute: string): void {
        this.routerExtensions.navigate([navItemRoute], {
            transition: {
                name: "fade"
            }
        });

        const sideDrawer = <RadSideDrawer>app.getRootView();
        sideDrawer.closeDrawer();
    }

    logout() {
        const sideDrawer = <RadSideDrawer>app.getRootView();
        sideDrawer.closeDrawer();
        this.auth.logout();
    }
}

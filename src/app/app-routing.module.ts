import { NgModule } from "@angular/core";
import { Routes } from "@angular/router";
import { NativeScriptRouterModule } from "nativescript-angular/router";
import { LoginComponent } from "./login/login.component";
import { RegisterComponent } from "./register/register.component";
import { LandingComponent } from "./landing/landing.component";
import { EditEntryComponent } from "./components/edit-entry/edit-entry.component";
import { BrowseComponent } from "./browse/browse.component";
import { SearchComponent } from "./search/search.component";
import { HomeComponent } from "./home/home.component";
import { SettingsComponent } from "./settings/settings.component";

const routes: Routes = [
    { path: "", redirectTo: "/home", pathMatch: "full" },
    { path: "home", component: HomeComponent },
    { path: "landing", component: LandingComponent },
    { path: "login", component: LoginComponent },
    { path: "editentry", component: EditEntryComponent },
    { path: "register", component: RegisterComponent },
    { path: "browse", component: BrowseComponent },
    { path: "search", component: SearchComponent },
    { path: "settings", component: SettingsComponent }
];

@NgModule({
    imports: [NativeScriptRouterModule.forRoot(routes)],
    exports: [NativeScriptRouterModule]
})
export class AppRoutingModule { }

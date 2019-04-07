import { NgModule, NO_ERRORS_SCHEMA } from "@angular/core";
import { NativeScriptModule } from "nativescript-angular/nativescript.module";
import { NativeScriptUISideDrawerModule } from "nativescript-ui-sidedrawer/angular";
import { NativeScriptFormsModule } from "nativescript-angular/forms";
import { DropDownModule } from "nativescript-drop-down/angular";

// Routing module
import { AppRoutingModule } from "./app-routing.module";

// Components
import { AppComponent } from "./app.component";
import { LoginComponent } from './login/login.component';
import { RegisterComponent } from './register/register.component';
import { LandingComponent } from './landing/landing.component';
import { EditEntryComponent } from './components/edit-entry/edit-entry.component';
import { CardComponent } from "./home/components/card/card.component";
import { ReportComponent } from "./home/components/report/report.component";
import { HomeComponent } from "./home/home.component";
import { BrowseComponent } from "./browse/browse.component";
import { SearchComponent } from "./search/search.component";
import { SettingsComponent } from "./settings/settings.component";
import { LoadingComponent } from './components/loading/loading.component';

@NgModule({
    bootstrap: [AppComponent],
    imports: [
        AppRoutingModule,
        NativeScriptModule,
        NativeScriptUISideDrawerModule,
        NativeScriptFormsModule,
        DropDownModule
    ],
    declarations: [
        AppComponent,
        LoginComponent,
        RegisterComponent,
        LandingComponent,
        EditEntryComponent,
        CardComponent,
        ReportComponent,
        HomeComponent,
        BrowseComponent,
        SearchComponent,
        SettingsComponent,
        LoadingComponent
    ],
    schemas: [NO_ERRORS_SCHEMA]
})
export class AppModule { }

import { NgModule, NO_ERRORS_SCHEMA } from "@angular/core";
import { NativeScriptCommonModule } from "nativescript-angular/common";
import { NativeScriptFormsModule } from "nativescript-angular/forms";

import { HomeRoutingModule } from "./home-routing.module";
import { HomeComponent } from "./home.component";
import { CardComponent } from "./components/card/card.component";
import { ReportComponent } from "./components/report/report.component";

@NgModule({
    imports: [
        NativeScriptCommonModule,
        HomeRoutingModule,
        NativeScriptFormsModule
    ],
    declarations: [HomeComponent, CardComponent, ReportComponent],
    schemas: [NO_ERRORS_SCHEMA]
})
export class HomeModule {}

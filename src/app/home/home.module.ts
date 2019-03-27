import { NgModule, NO_ERRORS_SCHEMA } from "@angular/core";
import { NativeScriptCommonModule } from "nativescript-angular/common";

import { HomeRoutingModule } from "./home-routing.module";
import { HomeComponent } from "./home.component";
import { CardComponent } from "./components/card/card.component";
import { ReportComponent } from './components/report/report.component';

@NgModule({
    imports: [NativeScriptCommonModule, HomeRoutingModule],
    declarations: [HomeComponent, CardComponent, ReportComponent],
    schemas: [NO_ERRORS_SCHEMA]
})
export class HomeModule {}

import { Component, OnInit, Input, OnChanges, SimpleChanges } from "@angular/core";
import { MLService } from "~/app/services/ml.service";

@Component({
    selector: "ns-report",
    templateUrl: "./report.component.html",
    styleUrls: ["./report.component.scss"],
    moduleId: module.id
})
export class ReportComponent implements OnInit {
    @Input() prediction;
    @Input() total;

    labelText;

    constructor() { }

    ngOnInit() {
        if (this.total > 0) {
            const percentage = (this.total / this.prediction) * 100;
            this.labelText = "You spent " + percentage.toFixed(2) + "% of the estimated expense for the day.";
        }
    }
}

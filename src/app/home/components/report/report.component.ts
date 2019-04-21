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
    @Input() date;

    constructor(private mlService: MLService) { }

    ngOnInit() {
        // NgOnInit
    }
}

import { Component, OnInit, Input } from "@angular/core";

@Component({
    selector: "ns-card",
    templateUrl: "./card.component.html",
    styleUrls: ["./card.component.scss"],
    moduleId: module.id
})
export class CardComponent implements OnInit {
    @Input() entryData;
    constructor() {}

    ngOnInit() {
        if (!this.entryData) {
            this.entryData = {
                category: "Transport",
                value: "75",
                desc: "Auto + Bus money"
            };
        }
    }
}

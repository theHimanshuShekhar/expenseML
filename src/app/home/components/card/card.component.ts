import { Component, OnInit, Input } from "@angular/core";
import { RouterExtensions } from "nativescript-angular/router";

@Component({
    selector: "ns-card",
    templateUrl: "./card.component.html",
    styleUrls: ["./card.component.scss"],
    moduleId: module.id
})
export class CardComponent implements OnInit {
    @Input() entryData;
    constructor(private router: RouterExtensions) { }

    ngOnInit() {
        //  Initialize values
    }

    editEntry() {
        this.router.navigate(["editentry"], {
            queryParams: {
                "date": this.entryData.date,
                "eid": this.entryData.eid,
                "desc": this.entryData.desc,
                "value": this.entryData.value,
                "category": this.entryData.category
            }
        });
    }
}

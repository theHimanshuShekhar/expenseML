import { Component, OnInit } from "@angular/core";
import { RadSideDrawer } from "nativescript-ui-sidedrawer";
import * as app from "tns-core-modules/application";
import { DataService } from "../services/data.service";

@Component({
    selector: "Search",
    moduleId: module.id,
    styleUrls: ["./search.component.scss"],
    templateUrl: "./search.component.html"
})
export class SearchComponent implements OnInit {

    allpiedata = [];

    allmonthlytotal = 0;
    allmonthlydata = {
        entertainment: 0,
        misc: 0,
        transport: 0,
        foodandgroceries: 0,
        healthcare: 0,
        bills: 0
    };

    monthlydata;
    dailydata;

    trainUsers = 0;
    busUsers = 0;
    bardata = [];

    localUsers = 0;
    outsideUsers = 0;
    billdata = [];

    localtrans = 0;
    outsidetrans = 0;
    transportdata = [];

    constructor(
        private dataService: DataService
    ) {
        // Use the component constructor to inject providers.
    }

    ngOnInit(): void {
        // Init your component properties here.
        this.dataService.getAllMonthly().then((data) => {
            this.monthlydata = data;
            data.map((datapoint) => {
                this.allmonthlydata = {
                    entertainment: this.allmonthlydata.entertainment + datapoint.entertainment,
                    misc: this.allmonthlydata.misc + datapoint.misc,
                    transport: this.allmonthlydata.transport + datapoint.transport,
                    foodandgroceries: this.allmonthlydata.foodandgroceries + datapoint.foodandgroceries,
                    healthcare: this.allmonthlydata.healthcare + datapoint.healthcare,
                    bills: this.allmonthlydata.bills + datapoint.bills
                };
                const currentexpend = datapoint.entertainment + datapoint.misc + datapoint.transport
                    + datapoint.foodandgroceries + datapoint.healthcare + datapoint.bills;
                this.allmonthlytotal = this.allmonthlytotal + currentexpend;
            });
            this.allpiedata.push({ category: "Transport", value: this.allmonthlydata.transport });
            this.allpiedata.push({ category: "Food", value: this.allmonthlydata.foodandgroceries });
            this.allpiedata.push({ category: "Entertainment", value: this.allmonthlydata.entertainment });
            this.allpiedata.push({ category: "Healthcare", value: this.allmonthlydata.healthcare });
            this.allpiedata.push({ category: "Bills", value: this.allmonthlydata.bills });
            this.allpiedata.push({ category: "Misc", value: this.allmonthlydata.misc });
        });
        this.dataService.getAllDaily().then((data) => {
            this.dailydata = data;
            let trainlen = 0;
            let buslen = 0;
            let locallen = 0;
            let outsidelen = 0;
            data.map((datapoint) => {
                switch (datapoint.modeoftransport) {
                    case "Train":
                        trainlen++;
                        this.trainUsers = this.trainUsers + datapoint.transport;
                        break;
                    case "Bus":
                        buslen++;
                        this.busUsers = this.busUsers + datapoint.transport;
                        break;
                }

                switch (datapoint.residential) {
                    case "Local":
                        locallen++;
                        this.localUsers = this.localUsers + datapoint.bills;
                        this.localtrans = this.localtrans + datapoint.transport;
                        break;
                    case "Outside Town":
                        outsidelen++;
                        this.outsideUsers = this.outsideUsers + datapoint.bills;
                        this.outsidetrans = this.localtrans + datapoint.transport;
                        break;
                }
            });
            this.transportdata.push({
                key: "Local", value: this.localtrans / locallen
            });
            this.transportdata.push({
                key: "Outside Town", value: this.outsidetrans / outsidelen
            });
            this.billdata.push({
                key: "Local", value: this.localUsers / locallen
            });
            this.billdata.push({
                key: "Outside Town", value: this.outsideUsers / outsidelen
            });
            this.bardata.push({
                key: "Bus", value: this.busUsers / buslen
            });
            this.bardata.push({
                key: "Train", value: this.trainUsers / trainlen
            });
        });
    }

    onDrawerButtonTap(): void {
        const sideDrawer = <RadSideDrawer>app.getRootView();
        sideDrawer.showDrawer();
    }
}

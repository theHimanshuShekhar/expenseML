import { Component, OnInit } from '@angular/core';
import { RouterExtensions } from 'nativescript-angular/router';
import { ActivatedRoute } from '@angular/router';
import { DataService } from '~/app/services/data.service';
import { SelectedIndexChangedEventData } from "nativescript-drop-down";

@Component({
  selector: 'ns-edit-entry',
  templateUrl: './edit-entry.component.html',
  styleUrls: ['./edit-entry.component.scss'],
  moduleId: module.id,
})
export class EditEntryComponent implements OnInit {
  categories = ["Food & Groceries", "Transport", "Bills", "Healthcare", "Entertainment", "Misc"];
  disablebtn = false;
  isupdate = false;
  showLoading;
  selectedIndex;
  date;
  eid;
  data = {
    desc: null,
    value: null,
    category: "test"
  };
  constructor(
    private router: RouterExtensions,
    private route: ActivatedRoute,
    private dataService: DataService) { }

  ngOnInit() {
    this.route.queryParams.subscribe((params) => {
      this.date = params["date"];
      this.eid = params["eid"];
      if (this.eid) {
        this.isupdate = true;
        this.data.desc = params["desc"];
        this.data.value = params["value"];
        this.data.category = params["category"];
        this.selectedIndex = this.categories.findIndex((elem) => elem === this.data.category);
      }
    });
  }

  addEntry() {
    if (!this.isupdate && this.disablebtn === false && this.data.category && this.data.value && this.data.desc) {
      this.data.value = Number(this.data.value);
      this.dataService.addEntry({ ...this.data, date: this.date });
      this.showLoading = true;
    }
    if (this.isupdate && this.disablebtn === false && this.data.category && this.data.value && this.data.desc) {
      this.data.value = Number(this.data.value);
      this.dataService.updateEntry({ ...this.data, date: this.date, eid: this.eid });
      this.showLoading = true;
    }
  }

  onBackButtonTap(): void {
    this.router.back();
  }

  onchange(args: SelectedIndexChangedEventData) {
    this.data.category = this.categories[args.newIndex];
  }
}

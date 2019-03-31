import { Component, OnInit } from '@angular/core';
import { RouterExtensions } from 'nativescript-angular/router';
import { ActivatedRoute } from '@angular/router';
import { DataService } from '~/app/services/data.service';

@Component({
  selector: 'ns-edit-entry',
  templateUrl: './edit-entry.component.html',
  styleUrls: ['./edit-entry.component.scss'],
  moduleId: module.id,
})
export class EditEntryComponent implements OnInit {
  disablebtn = false;
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
    });
  }

  addEntry() {
    if (this.disablebtn === false && this.data.category && this.data.value && this.data.desc) {
      this.dataService.addEntry({ ...this.data, date: this.date });
    }
  }

  onBackButtonTap(): void {
    this.router.back();
  }

}

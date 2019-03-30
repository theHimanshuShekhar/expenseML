import { Component, OnInit } from '@angular/core';
import { RouterExtensions } from 'nativescript-angular/router';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'ns-edit-entry',
  templateUrl: './edit-entry.component.html',
  styleUrls: ['./edit-entry.component.scss'],
  moduleId: module.id,
})
export class EditEntryComponent implements OnInit {
  date;
  constructor(
    private router: RouterExtensions,
    private route: ActivatedRoute) { }

  ngOnInit() {
    this.route.queryParams.subscribe((params) => {
      this.date = params["date"];
    });
  }

  onBackButtonTap(): void {
    this.router.back();
  }

}

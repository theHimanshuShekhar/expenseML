import { Component, OnInit } from '@angular/core';
import { RouterExtensions } from 'nativescript-angular/router';

@Component({
  selector: 'ns-edit-entry',
  templateUrl: './edit-entry.component.html',
  styleUrls: ['./edit-entry.component.scss'],
  moduleId: module.id,
})
export class EditEntryComponent implements OnInit {

  constructor(private router: RouterExtensions) { }

  ngOnInit() {
  }


  onBackButtonTap(): void {
    this.router.back();
  }

}

import { Component, OnInit } from '@angular/core';
import { Page } from 'tns-core-modules/ui/page/page';

@Component({
  selector: 'ns-landing',
  templateUrl: './landing.component.html',
  styleUrls: ['./landing.component.scss'],
  moduleId: module.id,
})
export class LandingComponent implements OnInit {

  constructor(private page: Page) { }

  ngOnInit() {
    this.page.actionBarHidden = true;
  }

}

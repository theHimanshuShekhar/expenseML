import { Component, OnInit } from '@angular/core';
import { Page } from 'tns-core-modules/ui/page/page';

@Component({
  selector: 'ns-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.scss'],
  moduleId: module.id,
})
export class RegisterComponent implements OnInit {
  googlesignin = false;
  constructor(private page: Page) { }

  ngOnInit() {
    this.page.actionBarHidden = true;
  }

  googleRegister() {
    this.googlesignin = !this.googlesignin;
  }

}

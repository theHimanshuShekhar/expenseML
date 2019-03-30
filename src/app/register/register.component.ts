import { Component, OnInit } from '@angular/core';
import { Page } from 'tns-core-modules/ui/page/page';
import { AuthService } from '../services/auth.service';

@Component({
  selector: 'ns-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.scss'],
  moduleId: module.id,
})
export class RegisterComponent implements OnInit {
  googlesignin = false;
  constructor(
    private page: Page,
    private auth: AuthService) { }

  ngOnInit() {
    this.page.actionBarHidden = true;
  }

  googleRegister() {
    this.googlesignin = !this.googlesignin;
    this.auth.loginGoogle();
  }

}

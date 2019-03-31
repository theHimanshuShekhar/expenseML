import { Component, OnInit } from '@angular/core';
import { Page } from 'tns-core-modules/ui/page/page';
import { AuthService } from '../services/auth.service';
import { DatePicker } from "tns-core-modules/ui/date-picker";

@Component({
  selector: 'ns-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.scss'],
  moduleId: module.id,
})
export class RegisterComponent implements OnInit {
  loading;
  user;
  dob;
  constructor(
    private page: Page,
    private auth: AuthService) { }

  ngOnInit() {
    this.page.actionBarHidden = true;
    this.loading = false;
  }

  googleLogin() {
    this.auth.registerTempGoogle().then((user) => {
      this.user = user;
    });
  }

  register() {
    if (this.user) {
      this.googleregister();
    } else {
      this.emailregister();
    }
  }
  emailregister() {
    // email register
    console.log("email register");
  }
  googleregister() {
    this.auth.registerGoogle({ dob: this.dob }).catch((error) => console.log(error));
  }

  onPickerLoaded(args) {
    const datePicker = <DatePicker>args.object;
    const currdate = new Date();
    datePicker.year = currdate.getFullYear();
    datePicker.month = currdate.getMonth();
    datePicker.day = currdate.getDay();
    datePicker.minDate = new Date(1975, 0, 29);
    datePicker.maxDate = new Date(currdate.getFullYear(), currdate.getMonth(), currdate.getDay());
  }

  onDateChanged(args) {
    this.dob = args.value;
  }
}

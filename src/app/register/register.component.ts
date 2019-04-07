import { Component, OnInit } from '@angular/core';
import { Page } from 'tns-core-modules/ui/page/page';
import { AuthService } from '../services/auth.service';
import { DatePicker } from "tns-core-modules/ui/date-picker";
import { SelectedIndexChangedEventData } from "nativescript-drop-down";

@Component({
  selector: 'ns-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.scss'],
  moduleId: module.id,
})
export class RegisterComponent implements OnInit {

  // New dropdowns
  incomeranges = ["Under 1L", "Under 5L", "Under 10L", "Above 10L"];
  allowance = ["Nil", "Under Rs.500", "Under Rs.1000", "Between Rs.1000 to Rs.5000", "Above Rs.5000"];
  residential = ["Local", "Outside Town"];
  modesoftransport = ["Walking", "Auto Rickshaw", "Bus", "Train", "Taxi", "Personal Vehicle"];
  colleges = ["Aided", "Un-Aided"];
  degrees = ["High School", "Undergraduate", "Graduate", "Postgraduate"];
  fields = ["Arts", "Science", "Commerce", "Computer Science / IT", "Management", "Hotel Management"];

  userdata = {
    dob: null,
    familyincome: null,
    allowance: null,
    residential: null,
    modeoftransport: null,
    college: null,
    education: null,
    edufield: null
  };

  showLoading;
  user;
  constructor(
    private page: Page,
    private auth: AuthService) { }

  ngOnInit() {
    this.page.actionBarHidden = true;
    this.showLoading = false;
  }

  googleLogin() {
    this.auth.registerTempGoogle().then((user) => {
      this.user = user;
    });
  }

  register() {
    this.showLoading = true;
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
    this.auth.registerGoogle(this.userdata).catch((error) => console.log(error));
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
    this.userdata.dob = args.value;
  }

  onIncomeChange(args: SelectedIndexChangedEventData) {
    this.userdata.familyincome = this.incomeranges[args.newIndex];
  }

  onAllowanceChange(args: SelectedIndexChangedEventData) {
    this.userdata.allowance = this.allowance[args.newIndex];
  }

  onResidentialChange(args: SelectedIndexChangedEventData) {
    this.userdata.residential = this.residential[args.newIndex];
  }

  onTransportChange(args: SelectedIndexChangedEventData) {
    this.userdata.modeoftransport = this.modesoftransport[args.newIndex];
  }

  onCollegeChange(args: SelectedIndexChangedEventData) {
    this.userdata.college = this.colleges[args.newIndex];
  }

  onDegreeChange(args: SelectedIndexChangedEventData) {
    this.userdata.education = this.degrees[args.newIndex];
  }
  onFieldChange(args: SelectedIndexChangedEventData) {
    this.userdata.edufield = this.fields[args.newIndex];
  }

}

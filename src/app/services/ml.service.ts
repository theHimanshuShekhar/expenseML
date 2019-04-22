import { Injectable } from "@angular/core";
import { FirebaseService } from "./firebase.service";
import { request, HttpResponse } from "tns-core-modules/http";

@Injectable({
  providedIn: 'root'
})
export class MLService {
  inputs = [];
  outputs = [];
  usermodel;

  constructor(private firebaseService: FirebaseService) {
  }

  predict(uid, date) {
    return request({
      url: "https://us-central1-expense-ml.cloudfunctions.net/predictGeneral?date=" + date + "&uid=" + uid,
      method: "GET"
    }).then((response: HttpResponse) => {
      console.log("Prediction recieved");
      if (response.statusCode == 200) {
        return response.content;
      } else {
        return null;
      }
    }, (err) => console.log(err));
  }
}

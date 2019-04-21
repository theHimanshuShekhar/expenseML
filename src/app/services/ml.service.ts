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

  async downloadModel() {
    // const documents = fs.knownFolders.documents();
    // const modelPath = documents.path + "model.json";
    // const weightsPath = documents.path + "weights.bin";

    // let localJson = documents.getFile("model.json");
    // let weights = documents.getFile("weights.bin");

    // await this.firebaseService.getFirebase().storage.downloadFile({
    //   remoteFullPath: "model.json",
    //   localFile: fs.File.fromPath(modelPath)
    // }).then(() => console.log("Model Loaded"));

    // await this.firebaseService.getFirebase().storage.downloadFile({
    //   remoteFullPath: "weights.bin",
    //   localFile: fs.File.fromPath(weightsPath)
    // }).then(() => console.log("Weights Loaded"));

    // localJson = documents.getFile("model.json");
    // weights = documents.getFile("weights.bin");

    // this.usermodel = await tf.loadLayersModel(
    //   "https://firebasestorage.googleapis.com/v0/b/expense-ml.appspot.com/o/model.json?alt=media&token=014678d6-cbf8-440e-8f91-ce2fd8e7755d"
    // );
    // this.usermodel.summary();
  }

  predict(uid, date) {
    return request({
      url: "https://us-central1-expense-ml.cloudfunctions.net/predictGeneral?date=" + date + "&uid=" + uid,
      method: "GET"
    }).then((response: HttpResponse) => {
      console.log("Prediction recieved");

      return response.content;
    }, (err) => console.log(err));
  }
}

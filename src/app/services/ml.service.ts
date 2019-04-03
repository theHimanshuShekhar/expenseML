import { Injectable } from '@angular/core';
import { firestore } from 'nativescript-plugin-firebase';

@Injectable({
  providedIn: 'root'
})
export class MLService {
  inputs = [];
  outputs = [];
  usermodel;

  constructor() { }

  checkUserModel(user) {
    // Check if user model exists
    const userDocRef = firestore.collection("users").doc(user.uid);
    userDocRef.get().then((userdoc) => {
      // @ts-ignore
      if (userdoc.model) {
        // User model exists
        console.log("User model exists");
      } else {
        // User model doesnt exist
        console.log("User model doesnt exist");
        this.getDataRecords(userDocRef).then(() => {
          setTimeout(() => {
            this.createModel(userDocRef);
          }, 3000);
        });
      }
    });
  }

  async getDataRecords(userdocref) {
    await userdocref.collection("records").get()
      .then((snapshot) => {
        let result;

        snapshot.forEach((record) => {
          result = this.getEntryData(userdocref, record.id);
        });

        return result;
      })
      .catch((err) => console.log(err));

  }

  async getEntryData(userdocref, rid) {
    await userdocref.collection("records").doc(rid).collection("records").get().then((snap) => {
      const expense = {
        date: null,
        food: 0,
        bills: 0,
        transport: 0,
        healthcare: 0,
        entertainment: 0,
        misc: 0
      };
      snap.forEach((entrydoc) => {
        const entry = entrydoc.data();
        expense.date = new Date(entry.date);
        if (entry.category === "Food & Groceries") {
          expense.food += Number(entry.value);
        } else if (entry.category === "Bills") {
          expense.bills += Number(entry.value);
        } else if (entry.category === "Transport") {
          expense.transport += Number(entry.value);
        } else if (entry.category === "Healthcare") {
          expense.healthcare += Number(entry.value);
        } else if (entry.category === "Misc") {
          expense.misc += Number(entry.value);
        }
      });

      this.outputs.push(
        [
          expense.food,
          expense.bills,
          expense.transport,
          expense.healthcare,
          expense.entertainment,
          expense.misc
        ]);

      this.inputs.push(
        [expense.date.getDay(),
        getWeek(expense.date),
        expense.date.getDate(),
        expense.date.getMonth(),
        expense.date.getFullYear()
        ]);

      return { inputdata: this.inputs, outputdata: this.outputs };
    });
  }

  createModel(userdocref) {
    // Create user model
    console.log("size:", this.inputs.length);
    console.log("inputs:", this.inputs);
    console.log("outputs:", this.outputs);

  }

  trainModel(data) {
    // train model
  }
}

function getWeek(date) {
  const firstDay = new Date(date.getYear(), date.getMonth(), 1).getDay();

  return Math.ceil((date.getDay() + firstDay) / 7);
}

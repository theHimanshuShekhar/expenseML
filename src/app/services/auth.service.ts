const firebase = require("nativescript-plugin-firebase");
import { firestore } from "nativescript-plugin-firebase";
import { Injectable } from "@angular/core";
import { RouterExtensions } from "nativescript-angular/router";

@Injectable({
    providedIn: "root"
})
export class AuthService {

    constructor(private router: RouterExtensions) { }

    registerTempGoogle() {
        return firebase.login({
            type: firebase.LoginType.GOOGLE
        }).then((result) => result,
            (errorMessage) => {
                console.log(errorMessage);
            }
        );
    }

    registerGoogle(data) {
        return firebase.login({
            type: firebase.LoginType.GOOGLE
        }).then((result) => {
            this.createUser({ ...data, ...result });
        },
            (errorMessage) => {
                console.log(errorMessage);
            }
        );
    }

    registerEmail(data) {
        // Register email user
    }

    createUser(user) {
        console.log("create user called");
        firestore.collection("users").doc(user.uid)
            .get().then((doc) => {
                if (doc.exists) {
                    this.router.navigateByUrl("/home");
                } else {
                    console.log("create user in firestore");
                    firestore.collection("users").doc(user.uid).set({
                        uid: user.uid,
                        name: user.name,
                        email: user.email,
                        dob: user.dob ? user.dob : null,
                        datejoined: firestore.FieldValue.serverTimestamp(),
                        location: user.location ? user.location : null,
                        occupation: user.occupation ? user.occupation : null,
                        income: user.income ? user.income : null
                    })
                        .then(() => this.router.navigateByUrl("/home"))
                        .catch((error) => console.log(error));
                }
            });
    }

    loginGoogle() {
        return firebase.login({
            type: firebase.LoginType.GOOGLE
        }).then((result) => {
            return firestore.collection("users").doc(result.uid)
                .get().then((doc) => {
                    let message;
                    if (doc.exists) {
                        message = "User is registered";
                        this.router.navigateByUrl("/home");
                    } else {
                        message = "User not registered.";
                        console.log(message);
                        firebase.logout();
                    }

                    return message;
                }).catch((error) => console.log(error));
        });
    }

    logout() {
        firebase.logout().then(() => this.redirect("landing"));
    }

    redirect(page) {
        this.router.navigateByUrl("/" + page);
    }

}

const functions = require('firebase-functions');
const admin = require('firebase-admin');
var json2csv = require('json2csv');
admin.initializeApp();


const afs = admin.firestore();

// // Create and Deploy Your First Cloud Functions
// // https://firebase.google.com/docs/functions/write-firebase-functions
//
// exports.helloWorld = functions.https.onRequest((request, response) => {
//  response.send("Hello from Firebase!");
// });

exports.onEntryAdd = functions.firestore
    .document("users/{uid}/daily/{rid}/entries/{eid}").onCreate((snap, context) => {
        const entry = snap.data();
        updateDateData({
            before: 0,
            after: entry.value,
            category: entry.category
        }, context.params.rid, context.params.uid);
        return createAnalyticsData(entry, context.params.uid);
    });

exports.onEntryUpdate = functions.firestore
    .document("users/{uid}/daily/{rid}/entries/{eid}").onUpdate((snap, context) => {
        const entry = snap.after.data();
        return updateDateData({
            before: snap.before.data().value,
            after: entry.value,
            category: entry.category
        }, context.params.rid, context.params.uid);
    });

exports.onDayUpdate = functions.firestore
    .document("users/{uid}/daily/{rid}").onUpdate((snap, context) => {

        return updateMonthData(context.params.uid, new Date(snap.after.data().date));
    });

function updateDateData(entry, rid, uid) {
    return afs.collection("users").doc(uid).collection("daily").doc(rid).collection("entries").get()
        .then((snap) => {

            let datedoc = {
                foodandgroceries: 0,
                transport: 0,
                bills: 0,
                healthcare: 0,
                entertainment: 0,
                misc: 0
            };
            snap.forEach((entrydoc) => {
                switch (entrydoc.data().category) {
                    case "Food & Groceries":
                        datedoc.foodandgroceries = datedoc.foodandgroceries + entrydoc.data().value;
                        break;

                    case "Transport":
                        datedoc.transport = datedoc.transport + entrydoc.data().value;
                        break;

                    case "Bills":
                        datedoc.bills = datedoc.bills + entrydoc.data().value;
                        break;

                    case "Healthcare":
                        datedoc.healthcare = datedoc.healthcare + entrydoc.data().value;
                        break;

                    case "Entertainment":
                        datedoc.entertainment = datedoc.entertainment + entrydoc.data().value;
                        break;

                    case "Misc":
                        datedoc.misc = datedoc.misc + entrydoc.data().value;
                        break;
                }
            });


            return datedoc;
        }).then((datedoc) => {

            return afs.collection("users").doc(uid).collection("daily").doc(rid).update(datedoc)
                .then(() => {
                    return dailyAnalyticsData(uid, datedoc, rid);
                })
                .catch((err) => console.log(err));
        })
        .catch((err) => console.log(err));
}

function updateMonthData(uid, date) {
    const months = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
    mondate = new Date(date);
    monthid = months[mondate.getMonth()] + "_" + mondate.getFullYear();

    afs.collection("users").doc(uid).collection("daily").where("year", "==", mondate.getFullYear()).where("month", "==", mondate.getMonth()).get()
        .then((snapshot) => {
            let monthdoc = {
                monthid: monthid,
                month: months[mondate.getMonth()],
                year: mondate.getFullYear(),
                foodandgroceries: 0,
                transport: 0,
                bills: 0,
                healthcare: 0,
                entertainment: 0,
                misc: 0
            };

            snapshot.forEach((daydoc) => {
                daydata = daydoc.data();

                monthdoc.foodandgroceries = monthdoc.foodandgroceries + daydata.foodandgroceries;
                monthdoc.transport = monthdoc.transport + daydata.transport;
                monthdoc.bills = monthdoc.bills + daydata.bills;
                monthdoc.healthcare = monthdoc.healthcare + daydata.healthcare;
                monthdoc.entertainment = monthdoc.entertainment + daydata.entertainment;
                monthdoc.misc = monthdoc.misc + daydata.misc;
            });

            return afs.collection("users").doc(uid).collection("monthly").doc(monthid).set(monthdoc)
                .then(() => monthAnalyticsData(uid, monthdoc))
                .catch((err) => console.log(err));

        }).catch((err) => console.log(err));
}

function monthAnalyticsData(uid, doc) {
    return afs.collection("users").doc(uid).get().then((userdoc) => {
        const userdata = userdoc.data();

        const record = {
            uid: uid,
            dob: userdata.dob,
            familyincome: userdata.familyincome,
            allowance: userdata.allowance,
            residential: userdata.residential,
            modeoftransport: userdata.modeoftransport,
            college: userdata.college,
            education: userdata.education,
            edufield: userdata.edufield,

            bills: doc.bills,
            entertainment: doc.entertainment,
            foodandgroceries: doc.foodandgroceries,
            healthcare: doc.healthcare,
            misc: doc.misc,
            transport: doc.transport
        };
        monthlyid = uid + "_" + doc.monthid;
        return afs.collection("monthlydata").doc(monthlyid).set(record);
    }).catch((err) => console.log(err));
}


function dailyAnalyticsData(uid, doc, rid) {
    return afs.collection("users").doc(uid).get().then((userdoc) => {
        const userdata = userdoc.data();

        const record = {
            uid: uid,
            dob: userdata.dob,
            familyincome: userdata.familyincome,
            allowance: userdata.allowance,
            residential: userdata.residential,
            modeoftransport: userdata.modeoftransport,
            college: userdata.college,
            education: userdata.education,
            edufield: userdata.edufield,
            date: doc.date,
            bills: doc.bills,
            entertainment: doc.entertainment,
            foodandgroceries: doc.foodandgroceries,
            healthcare: doc.healthcare,
            misc: doc.misc,
            transport: doc.transport
        };
        dailyid = uid + "_" + rid;
        return afs.collection("dailydata").doc(dailyid).set(record);
    }).catch((err) => console.log(err));
}

exports.onDailyAdd = functions.firestore
    .document("dailydata/{docid}").onUpdate((snap, context) => {
        return afs.collection("dailydata").get().then((snapshot) => {
            const data = [];
            snapshot.forEach((snap) => {
                const daydoc = snap.data();
                daydoc.age = calculate_age(daydoc.dob.toDate());
                data.push(daydoc);
            });

            return data;
        }).then((jsondata) => {

            setTimeout(() => {
                console.log("Size: ", jsondata.length);
                console.log(jsondata);
            }, 20000);

            return true;
        });
    });


function calculate_age(dob) {
    var diff_ms = Date.now() - dob.getTime();
    var age_dt = new Date(diff_ms);

    return Math.abs(age_dt.getUTCFullYear() - 1970);
}

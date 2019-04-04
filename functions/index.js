const functions = require('firebase-functions');
const admin = require('firebase-admin');
admin.initializeApp();


const afs = admin.firestore();

// // Create and Deploy Your First Cloud Functions
// // https://firebase.google.com/docs/functions/write-firebase-functions
//
// exports.helloWorld = functions.https.onRequest((request, response) => {
//  response.send("Hello from Firebase!");
// });

exports.onEntryAdd = functions.firestore
    .document("users/{uid}/records/{rid}/records/{eid}").onCreate((snap, context) => {
        const entry = snap.data();
        return createAnalyticsData(entry, context.params.uid);
    });

exports.onEntryUpdate = functions.firestore
    .document("users/{uid}/records/{rid}/records/{eid}").onUpdate((snap, context) => {
        const entry = snap.after.data();
        return createAnalyticsData(entry, context.params.uid);
    });


function createAnalyticsData(entry, uid) {
    return afs.collection("users").doc(uid).get().then((userdoc) => {
        const userdata = userdoc.data();

        const record = {
            location: userdata.location,
            occupation: userdata.occupation,
            income: userdata.income,
            date: new Date(entry.date),
            category: entry.category,
            eid: entry.eid,
            value: Number(entry.value),
            day: null,
            month: null,
            year: null
        };

        record.day = record.date.getDay();
        record.month = record.date.getMonth();
        record.year = record.date.getFullYear();

        return afs.collection("data").doc(record.eid).set(record);
    }).catch((err) => console.log(err));
}

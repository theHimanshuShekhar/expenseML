const functions = require('firebase-functions');
const admin = require('firebase-admin');
admin.initializeApp();

const afs = admin.firestore();

// Machine Learning imports
const tf = require("@tensorflow/tfjs");
require("tfjs-node-save");

const path = require('path');
const os = require('os');
const fs = require('fs');



exports.onEntryAdd = functions.firestore
    .document("users/{uid}/daily/{rid}/entries/{eid}").onCreate((snap, context) => {
        const entry = snap.data();
        updateDateData({
            before: 0,
            after: entry.value,
            category: entry.category
        }, context.params.rid, context.params.uid);
        return true;
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
        return afs.collection("models").doc("general").get().then(modeldata => {
            const modeldoc = modeldata.data();
            const currDate = new Date();
            const modelDate = modeldoc.date.toDate();
            const daysElapsed = Math.floor((currDate - modelDate) / (1000 * 60 * 60 * 24));
            if (daysElapsed >= 7) {
                return setupGeneralModel();
            } else {
                return null;
            }
        }).then(() => {
            setupUserModel();
            return updateMonthData(context.params.uid, new Date(snap.after.data().date));
        }).catch((err) => console.log(err));
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

    return afs.collection("users").doc(uid).collection("daily").where("year", "==", mondate.getFullYear()).where("month", "==", mondate.getMonth()).get()
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
            // date: doc.date,
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

function calculate_age(dob) {
    var diff_ms = Date.now() - dob.getTime();
    var age_dt = new Date(diff_ms);

    return Math.abs(age_dt.getUTCFullYear() - 1970);
}

incomeranges = ["Under 1L", "Under 5L", "Under 10L", "Above 10L"];
residential = ["Local", "Outside Town"];
modesoftransport = ["Walking", "Auto Rickshaw", "Bus", "Train", "Taxi", "Personal Vehicle"];
colleges = ["Aided", "Un-Aided"];
degrees = ["High School", "Undergraduate", "Graduate", "Postgraduate"];
fields = ["Arts", "Science", "Commerce", "Computer Science / IT", "Management", "Hotel Management"];

function setupGeneralModel() {
    return afs.collection("dailydata").get().then((snapshot) => {
        let inputs = [];
        let outputs = [];
        snapshot.forEach(dailydoc => {
            const dailydata = dailydoc.data();
            inputs.push([
                dailydata.allowance,
                this.incomeranges.indexOf(dailydata.familyincome),
                this.degrees.indexOf(dailydata.education),
                this.fields.indexOf(dailydata.edufield),
                this.colleges.indexOf(dailydata.college),
                this.modesoftransport.indexOf(dailydata.modeoftransport),
                getAge(dailydata.dob.toDate()),
            ]);
            outputs.push([
                dailydata.bills +
                dailydata.entertainment +
                dailydata.foodandgroceries +
                dailydata.healthcare +
                dailydata.transport +
                dailydata.misc
            ]);
        })
        return trainModel(inputs, outputs);
    }).catch(err => console.log(err));
}

async function trainModel(input, output) {
    console.log("Creating general Model");
    let train_x = input;
    let train_y = output;

    const xs = tf.tensor2d(train_x, [train_x.length, 7]);
    const ys = tf.tensor2d(train_y, [train_y.length, 1]);
    const model = tf.sequential();
    model.add(tf.layers.dense({
        units: 16,
        batchInputShape: [train_y.length, 7]
    }));
    model.add(tf.layers.dense({
        units: 1
    }));
    model.compile({
        loss: 'meanSquaredError',
        optimizer: 'sgd'
    });

    model.compile({
        loss: 'meanSquaredError',
        optimizer: 'adam'
    });

    return await model.fit(xs, ys, {
        epochs: 16
    }).then(async () => {
        console.log("General model trained with " + xs.size + " records.")
        const tmpdir = os.tmpdir();
        const modelPath = await path.join(tmpdir, "model");
        const tempJSONPath = await path.join(modelPath, "model.json");
        const tempBINPath = await path.join(modelPath, "weights.bin");

        await model.save("file://" + modelPath);

        const bucket = admin.storage().bucket("expense-ml.appspot.com");
        await bucket.upload(tempJSONPath);
        await bucket.upload(tempBINPath);
        console.log("Model uploaded.");

        // Delete the temporary files
        fs.unlinkSync(tempJSONPath);
        fs.unlinkSync(tempBINPath);
        return true;
    }).then(() => {
        return afs.collection("models").doc("general").update({
                sizeofdata: input.length,
                date: admin.firestore.FieldValue.serverTimestamp()
            })
            .then(() => console.log("General model doc updated."))
            .catch(err => console.log(err));
    });
}

function setupUserModel() {

}

function getAge(dob) {
    const diff_ms = Date.now() - dob.getTime();
    const age_dt = new Date(diff_ms);
    return Math.abs(age_dt.getUTCFullYear() - 1970);
}

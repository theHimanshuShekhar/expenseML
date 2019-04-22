const functions = require('firebase-functions');
const admin = require('firebase-admin');
admin.initializeApp();

const cors = require('cors')({
    origin: true
});

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
            // setupUserModel(context.params.uid);
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
        dailyid = uid + "_" + rid;
        const datedata = rid.split(uid)[1].split("_").slice(1);
        const date = new Date(datedata[2], datedata[1], datedata[0]);
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
            date: date,
            bills: doc.bills,
            entertainment: doc.entertainment,
            foodandgroceries: doc.foodandgroceries,
            healthcare: doc.healthcare,
            misc: doc.misc,
            transport: doc.transport
        };
        return afs.collection("dailydata").doc(dailyid).set(record);
    }).catch((err) => console.log(err));
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
                incomeranges.indexOf(dailydata.familyincome),
                degrees.indexOf(dailydata.education),
                fields.indexOf(dailydata.edufield),
                colleges.indexOf(dailydata.college),
                modesoftransport.indexOf(dailydata.modeoftransport),
                getAge(dailydata.dob.toDate()),
                dailydata.date.toDate().getDay()
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

    const xs = tf.tensor2d(train_x, [train_x.length, 8]);
    const ys = tf.tensor2d(train_y, [train_y.length, 1]);
    const model = tf.sequential();
    model.add(tf.layers.dense({
        units: 16,
        batchInputShape: [train_y.length, 8]
    }));
    model.add(tf.layers.dense({
        units: 1
    }));

    model.compile({
        loss: 'meanSquaredError',
        optimizer: 'adam'
    });

    return await model.fit(xs, ys, {
        epochs: 16
    }).then(async () => {
        console.log("General model trained with " + train_x.length + " records.")
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

function setupUserModel(uid) {
    return afs.collection("users").doc(uid).collection("daily").get().then(async (snapshot) => {
        let inputs = [];
        let outputs = [];
        snapshot.forEach(dailydoc => {
            const dailydata = dailydoc.data();
            const ddate = new Date(dailydata.date);
            inputs.push([
                ddate.getDay(),
                ddate.getDate(),
                ddate.getMonth(),
                ddate.getFullYear()
            ]);
            outputs.push([
                dailydata.bills +
                dailydata.entertainment +
                dailydata.foodandgroceries +
                dailydata.healthcare +
                dailydata.transport +
                dailydata.misc
            ]);
        });

        const xs = tf.tensor2d(inputs, [inputs.length, 4]);
        const ys = tf.tensor2d(outputs, [outputs.length, 1]);
        const model = tf.sequential();
        model.add(tf.layers.dense({
            units: 16,
            batchInputShape: [inputs.length, 4]
        }));
        model.add(tf.layers.dense({
            units: 1
        }));
        model.compile({
            loss: 'meanSquaredError',
            optimizer: 'sgd'
        });

        return await model.fit(xs, ys, {
            epochs: 16
        }).then(async () => {
            console.log("General model trained with " + inputs.length + " records.")
            const tmpdir = os.tmpdir();
            const modelPath = await path.join(tmpdir, "model");
            const tempJSONPath = await path.join(modelPath, "model.json");
            const tempBINPath = await path.join(modelPath, "weights.bin");

            await model.save("file://" + uid);
            const bucket = admin.storage().bucket("expense-ml.appspot.com");
            await bucket.upload("file://" + uid + "/model.json");
            await bucket.upload(tempBINPath);
            console.log("Model uploaded.");
            // Delete the temporary files
            fs.unlinkSync(tempJSONPath);
            fs.unlinkSync(tempBINPath);

            return true;
        }).then(() => {
            return afs.collection("users").doc(uid).update({
                    date: admin.firestore.FieldValue.serverTimestamp()
                })
                .then(() => console.log("User model doc updated."))
                .catch(err => console.log(err));
        });

    }).catch(err => console.log(err));
}

function getAge(dob) {
    const diff_ms = Date.now() - dob.getTime();
    const age_dt = new Date(diff_ms);
    return Math.abs(age_dt.getUTCFullYear() - 1970);
}


exports.predictGeneral = functions.https.onRequest(async (req, res) => {
    res.set("Access-Control-Allow-Origin", "*");
    res.set("Access-Control-Allow-Methods", "GET");
    res.set("Access-Control-Allow-Headers", "Content-Type");
    res.set("Access-Control-Max-Age", "3600");
    // Send response to OPTIONS requests and terminate the function execution
    if (req.method === 'OPTIONS') {
        res.status(204).send('');
    }

    const date = req.query.date;
    const uid = req.query.uid;

    const bucket = admin.storage().bucket("expense-ml.appspot.com");
    const tmpdir = os.tmpdir();

    await bucket.file("model.json").download({
        destination: path.join(tmpdir, "model.json")
    });
    await bucket.file("weights.bin").download({
        destination: path.join(tmpdir, "weights.bin")
    });
    const model = await tf.loadLayersModel("file://" + path.join(tmpdir, "model.json"));
    afs.collection("users").doc(uid).get().then((userdoc) => {
        const userdata = userdoc.data();
        const newdate = new Date(date).getDay();
        const input = [
            userdata.allowance,
            incomeranges.indexOf(userdata.familyincome),
            degrees.indexOf(userdata.education),
            fields.indexOf(userdata.edufield),
            colleges.indexOf(userdata.college),
            modesoftransport.indexOf(userdata.modeoftransport),
            getAge(userdata.dob.toDate()),
            newdate
        ];
        const prediction = predict(model, input);
        res.status(200).send({
            prediction,
            input
        });
        return true;
    }).catch((err) => console.log(err));

});

function predict(model, input) {
    const predictdata = tf.tensor2d(input, [1, 8]);
    const prediction = model.predict(predictdata).dataSync()[0];
    return Math.ceil(prediction / 10) * 10;
}

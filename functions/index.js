const express = require("express");
const cors = require("express");
const functions = require("firebase-functions");
const admin = require("firebase-admin");
const serviceAccount = require("./serviceAccountKey.json");

const app = express();

app.use(cors({ origin: true }));


admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
});

const db = admin.firestore();

// route

app.get("/", (req, res) => {
  res.send("everything will be fine");
});

// post user :

app.post("/user", async (req, res) => {
  try {
    await db.collection("users").doc(`/${Date.now()}/`).create({
      id: Date.now(),
      userName: req.body.userName,
      age: req.body.age,
      address: req.body.address,
    });
    res.status(200).send({ success: true, msg: "data saved is successfully" });
  } catch (err) {
    console.log(err);
  }
});

// load specifi user

app.get("/user/:id", async (req, res) => {
  try {
    const id = req.params.id;
    const reqDoc = db.collection("users").doc(id);
    const userDetail = await reqDoc.get();
    const data = userDetail.data();
    res.status(200).send({ success: true, data });
  } catch (err) {
    console.log(err);
    res.status(500).send({ success: false, err });
  }
});

// load all data :

app.get("/user", async (req, res) => {
  try {
    const query = db.collection("users");
    const response = [];
    await query.get().then((data) => {
      const docs = data.docs;
      docs.map((doc) => {
        const seletedDoc = {
          id: doc.data().id,
          userName: doc.data().userName,
          age: doc.data().age,
          address: doc.data().address,
        };
        response.push(seletedDoc);
      });
      return response;
    });
    res.status(200).send({ success: true, data: response });
  } catch (err) {
    console.log(err);
    res.status(500).send({ success: false, err });
  }
});

// update a specific doc :

app.put("/user/:id", async (req, res) => {
  try {
    await db.collection("users").doc(req.params.id).update({
      userName: req.body.userName,
      age: req.body.age,
      address: req.body.address,
    });
    res
      .status(200)
      .send({
        success: true,
        msg: "data updated successfylly is successfully",
      });
  } catch (err) {
    console.log(err);
  }
});

// delte specific data :

app.delete("/user/:id", async (req, res) => {
  try {
    await db.collection("users").doc(req.params.id).delete();
    res
      .status(200)
      .send({
        success: true,
        msg: "delete  successfull",
      });
  } catch (err) {
    console.log(err);
  }
});

exports.app = functions.https.onRequest(app);

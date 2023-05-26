// simple express server
const express = require("express");
const mongoose = require("mongoose");

const service_name = "audit-service";
const mongo_host = process.env.MONGO_SERVICE_HOST;
const mongo_username = process.env.MONGO_INITDB_ROOT_USERNAME;
const mongo_password = process.env.MONGO_INITDB_ROOT_PASSWORD;
const mongo_uri = `mongodb://${mongo_username}:${mongo_password}@${mongo_host}:27017/notes?authSource=admin`;

const app = express();
app.use(express.json());

const port = 3000;

var mongo_connected = false;

mongoose
  .connect(mongo_uri, { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => {
    console.log("Connected to MongoDB");
    mongo_connected = true;
  });

app.get("/", (req, res) =>
  res.send(
    `Hello from ${service_name}! ${
      mongo_connected ? "Connected to MongoDB" : "Not connected to MongoDB"
    }`
  )
);

const Audit = mongoose.model("Audit", {
  user: String,
  action: String,
  timestamp: String,
});

app.post("/audit", async (req, res) => {
  try {
    const audit = new Audit(req.body);
    await audit.save();
    res.send(audit);
    console.log(audit);
  } catch (err) {
    res.status(500).send({
      message: err.message || "Some error occurred while creating the Audit.",
    });
  }
});

app.listen(port, () =>
  console.log(`${service_name} listening on port ${port}!`)
);

// simple express server
const express = require("express");
const mongoose = require("mongoose");

const service_name = "notes-service";
const mongo_host = process.env.MONGO_SERVICE_HOST;
const mongo_username = process.env.MONGO_INITDB_ROOT_USERNAME;
const mongo_password = process.env.MONGO_INITDB_ROOT_PASSWORD;
const mongo_uri = `mongodb://${mongo_username}:${mongo_password}@${mongo_host}:27017/notes?authSource=admin`;

const app = express();
const port = 3000;

mongoose
  .connect(mongo_uri, { useNewUrlParser: true })
  .catch((err) => {
    console.log(err);
  })
  .finally(() => {
    console.log(`${service_name} connected to MongoDB`);
  });

app.get("/", (req, res) => res.send(`Hello from ${service_name}!`));

app.listen(port, () =>
  console.log(`${service_name} listening on port ${port}!`)
);

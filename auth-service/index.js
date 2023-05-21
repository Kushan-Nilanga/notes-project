// simple express server
const express = require("express");
const mongoose = require("mongoose");
const passport = require("passport");
const passportJWT = require("passport-jwt");
const jwt = require("jsonwebtoken");

const service_name = "auth-service";
const mongo_host = process.env.MONGO_SERVICE_HOST;
const mongo_username = process.env.MONGO_INITDB_ROOT_USERNAME;
const mongo_password = process.env.MONGO_INITDB_ROOT_PASSWORD;
const mongo_uri = `mongodb://${mongo_username}:${mongo_password}@${mongo_host}:27017/notes?authSource=admin`;

const app = express();
app.use(express.json());
const port = 3000;

mongoose.connect(mongo_uri, { useNewUrlParser: true }).then(() => {
  console.log("Connected to MongoDB");
});

app.get("/", (req, res) => res.send(`Hello from ${service_name}!`));

/** this service handles use creation, authentication and jwt */
const User = mongoose.model("User", {
  email: String,
  password: String,
});

// create a user
app.post("/users", async (req, res) => {
  try {
    const user = new User(req.body);
    await user.save();
    res.send(user);
  } catch (err) {
    res.status(500).send({
      message: err.message || "Some error occurred while creating the User.",
    });
  }
});

app.post("/users/validate", async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).send({
        message: "Email and password are required.",
      });
    }

    // find the user
    const user = await User.findOne({
      email: email,
      password: password,
    }).exec();
    if (!user) {
      return res.status(401).send({
        message: "Invalid email or password.",
      });
    }

    res.send(user);
  } catch (err) {
    res.status(500).send({
      message: err.message || "Some error occurred while authenticating.",
    });
  }
});

// authenticate a user and return a jwt
app.post("/users/authenticate", async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).send({
        message: "Email and password are required.",
      });
    }

    // find the user
    const user = await User.findOne({
      email: email,
      password: password,
    }).exec();
    if (!user) {
      return res.status(401).send({
        message: "Invalid email or password.",
      });
    }

    // generate a jwt
    const token = jwt.sign({ email, password, passport }, "secret", {
      expiresIn: 3600,
    });

    // return the jwt
    res.send({
      token,
    });
  } catch (err) {
    res.status(500).send({
      message: err.message || "Some error occurred while authenticating.",
    });
  }
});

app.listen(port, () =>
  console.log(`${service_name} listening on port ${port}!`)
);

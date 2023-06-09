// simple express server
const axios = require("axios");
const express = require("express");
const passport = require("passport");
const passportJWT = require("passport-jwt");
const app = express();
app.use(express.json());

// cors
const cors = require("cors");
app.use(cors());

// services
const notes_service_uri = process.env.NOTES_SERVICE_URI;
const auth_service_uri = process.env.AUTH_SERVICE_URI;
const audit_service_uri = process.env.AUDIT_SERVICE_URI;

const port = 3000;

app.get("/", (req, res) => {
  // ping the notes, auth, and audit services
  const notes = axios.get(`${notes_service_uri}/`);
  const auth = axios.get(`${auth_service_uri}/`);
  const audit = axios.get(`${audit_service_uri}/`);

  Promise.all([notes, auth, audit])
    .then((values) => {
      res.send(
        `Hello from bff-service! <br/>
        Notes: ${values[0].data} <br/>
        Auth: ${values[1].data} <br/>
        Audit: ${values[2].data} <br/>`
      );
    })
    .catch((err) => {
      res.send(
        `Hello from bff-service! Notes: ${err} Auth: ${err} Audit: ${err}`
      );
    });
});

app.listen(port, () => console.log(`bff-service listening on port ${port}!`));

// verify a jwt
const jwtStrategy = passportJWT.Strategy;
const extractJWT = passportJWT.ExtractJwt;
const jwtOptions = {
  jwtFromRequest: extractJWT.fromAuthHeaderAsBearerToken(),
  secretOrKey: "secret",
};

passport.use(
  new jwtStrategy(jwtOptions, async (jwt_payload, done) => {
    try {
      const { email, password } = jwt_payload;
      const { data } = await axios.post(`${auth_service_uri}/users/validate`, {
        email: email,
        password: password,
      });

      if (data) {
        return done(null, data);
      }

      return done(null, false);
    } catch (err) {
      return done("error processing request", false);
    }
  })
);

function post_audit_item(item) {
  axios.post(`${audit_service_uri}/audit`, item);
}

// notes
// create note
app.post(
  "/create_note",
  passport.authenticate("jwt", { session: false }),
  async (req, res) => {
    console.log(req.body);
    try {
      const { title, content } = req.body;
      const { data } = await axios.post(`${notes_service_uri}/notes`, {
        title: title,
        content: content,
      });

      post_audit_item({
        user: req.user.email,
        action: "create_note",
        note_id: data._id,
        timestamp: new Date(),
      });

      res.send(data);
    } catch (err) {
      res.status(500).send({
        message: err.message || "Some error occurred while creating the Note.",
      });
    }
  }
);

// get all notes
app.get(
  "/get_notes",
  passport.authenticate("jwt", { session: false }),
  async (req, res) => {
    try {
      const { data } = await axios.get(`${notes_service_uri}/notes`);

      post_audit_item({
        user: req.user.email,
        action: "get_notes",
        timestamp: new Date(),
      });

      res.send(data);
    } catch (err) {
      res.status(500).send({
        message: err.message || "Some error occurred while retrieving notes.",
      });
    }
  }
);

// update note by id
app.put(
  "/update_note/:id",
  passport.authenticate("jwt", { session: false }),
  async (req, res) => {
    try {
      const { title, content } = req.body;
      const { id } = req.params;
      const { data } = await axios.put(`${notes_service_uri}/notes/${id}`, {
        title: title,
        content: content,
      });

      post_audit_item({
        user: req.user.email,
        action: "update_note",
        timestamp: new Date(),
        note_id: id,
      });

      res.send(data);
    } catch (err) {
      res.status(500).send({
        message: err.message || "Some error occurred while updating the Note.",
      });
    }
  }
);

// delete note by id
app.delete(
  "/delete_note/:id",
  passport.authenticate("jwt", { session: false }),
  async (req, res) => {
    try {
      const { id } = req.params;
      const { data } = await axios.delete(`${notes_service_uri}/notes/${id}`);

      post_audit_item({
        user: req.user.email,
        action: "delete_note",
        timestamp: new Date(),
        note_id: id,
      });

      res.send(data);
    } catch (err) {
      res.status(500).send({
        message: err.message || "Some error occurred while deleting the Note.",
      });
    }
  }
);

// create user
app.post("/create_user", async (req, res) => {
  try {
    const { email, password } = req.body;
    const { data } = await axios.post(`${auth_service_uri}/users`, {
      email: email,
      password: password,
    });

    post_audit_item({
      user: email,
      action: "create_user",
      timestamp: new Date(),
    });

    res.send(data);
  } catch (err) {
    res.status(500).send({
      message: err.message || "Some error occurred while creating the User.",
    });
  }
});

// login user
app.post("/login", async (req, res) => {
  try {
    const { email, password } = req.body;
    const { data } = await axios.post(
      `${auth_service_uri}/users/authenticate`,
      {
        email: email,
        password: password,
      }
    );

    post_audit_item({
      user: email,
      action: "login",
      timestamp: new Date(),
    });

    res.send(data);
  } catch (err) {
    res.status(500).send({
      message: err.message || "Some error occurred while logging in.",
    });
  }
});

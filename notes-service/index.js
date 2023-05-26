// simple express server
const express = require("express");
const mongoose = require("mongoose");

const service_name = "notes-service";
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

/**
 * this service saves notes to mongodb using mongoose
 */
const Note = mongoose.model("Note", {
  title: String,
  content: String,
});

// get all notes
app.get("/notes", async (req, res) => {
  try {
    const notes = await Note.find();
    res.send(notes);
  } catch (err) {
    res.status(500).send({
      message: err.message || "Some error occurred while retrieving notes.",
    });
  }
});

// update a note
app.put("/notes/:id", (req, res) => {
  // Validate Request
  if (!req.body.content) {
    return res.status(400).send({
      message: "Note content can not be empty",
    });
  }

  // Find note and update it with the request body
  Note.findByIdAndUpdate(
    req.params.id,
    {
      title: req.body.title || "Untitled Note",
      content: req.body.content,
    },
    { new: true }
  )
    .then((note) => {
      if (!note) {
        return res.status(404).send({
          message: "Note not found with id " + req.params.id,
        });
      }
      res.send(note);
    })
    .catch((err) => {
      if (err.kind === "ObjectId") {
        return res.status(404).send({
          message: "Note not found with id " + req.params.id,
        });
      }
      return res.status(500).send({
        message: "Error updating note with id " + req.params.id,
      });
    });
});

// create a note
app.post("/notes", (req, res) => {
  // Validate request
  if (!req.body.content) {
    return res.status(400).send({
      message: "Note content can not be empty",
    });
  }

  // Create a Note
  const note = new Note({
    title: req.body.title || "Untitled Note",
    content: req.body.content,
  });

  // Save Note in the database
  note
    .save()
    .then((data) => {
      res.send(data);
    })
    .catch((err) => {
      console.log(err);
      res.status(500).send({
        message: err.message || "Some error occurred while creating the Note.",
      });
    });
});

// delete a note
app.delete("/notes/:id", (req, res) => {
  Note.findByIdAndRemove(req.params.id)
    .then((note) => {
      if (!note) {
        return res.status(404).send({
          message: "Note not found with id " + req.params.id,
        });
      }
      res.send({ message: "Note deleted successfully!" });
    })
    .catch((err) => {
      if (err.kind === "ObjectId" || err.name === "NotFound") {
        return res.status(404).send({
          message: "Note not found with id " + req.params.id,
        });
      }
      return res.status(500).send({
        message: "Could not delete note with id " + req.params.id,
      });
    });
});

app.listen(port, () =>
  console.log(`${service_name} listening on port ${port}!`)
);

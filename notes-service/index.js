// simple express server
const express = require("express");
const app = express();
const port = 3000;

app.get("/", (req, res) => res.send("Hello from notes-service!"));

app.listen(port, () => console.log(`notes-service listening on port ${port}!`));

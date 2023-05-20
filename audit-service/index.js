// simple express server
const express = require("express");
const app = express();
const port = 3000;

app.get("/", (req, res) => res.send("Hello from audit-service!"));

app.listen(port, () => console.log(`audit-service listening on port ${port}!`));

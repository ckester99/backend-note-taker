const express = require("express");
const path = require("node:path");
const fs = require("fs");
const util = require("util");
const app = express();
const port = 3001;

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static("public"));

const readFromFile = util.promisify(fs.readFile);

app.get("/", (req, res) => {
    res.sendFile("./public/index.html");
});

app.get("/notes", (req, res) => {
    res.sendFile(path.join(__dirname, "./public/notes.html"));
});

app.get("/api/notes", (req, res) => {
    readFromFile("./db/db.json").then((data) => res.json(JSON.parse(data)));
});

app.listen(port, () => {
    console.log(`App is listening on port ${port}`);
});

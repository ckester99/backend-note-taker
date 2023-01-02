const express = require("express");
const path = require("node:path");
const fs = require("fs");
const util = require("util");
const uniqid = require("uniqid");
const app = express();
const port = 3001;

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static("public"));

const readFromFile = util.promisify(fs.readFile);
const writeToFile = (destination, content) =>
    fs.writeFile(destination, JSON.stringify(content, null, 4), (err) =>
        err ? console.error(err) : console.info(`\nData written to ${destination}`)
    );
const readAndAppend = (content, file) => {
    fs.readFile(file, "utf8", (err, data) => {
        if (err) {
            console.error(err);
        } else {
            const parsedData = JSON.parse(data);
            parsedData.push(content);
            writeToFile(file, parsedData);
        }
    });
};

app.post("/api/notes", (req, res) => {
    const { title, text } = req.body;

    if (title && text) {
        const newFeedback = {
            title,
            text,
            id: uniqid(),
        };

        readAndAppend(newFeedback, "./db/db.json");

        const response = {
            status: "success",
            body: newFeedback,
        };
        console.log(`Post Response: ${response}`);
        res.json(response);
    } else {
        res.json("Error in posting feedback");
    }
});

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

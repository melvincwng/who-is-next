const express = require("express");
const app = express();
app.use(express.json());

//DATA
const object = {
    "0": "GET    /",
    "1": "GET    /jumplings",
    "2": "POST   /jumplings",
    "3": "GET /jumplings/:name",
    "4": "PUT /jumplings/:id",
    "5": "DELETE /jumplings/:id",
    "6": "-----------------------",
    "7": "GET    /jumplings/presenter"
  };
const jumplings = [];

// PARAMS PROCESSING

// ROUTES
app.get("/", (req, res) => {
    res.status(200).send(object);
});

app.get("/jumplings", (req, res) => {
    res.status(200).send(jumplings);
});

// ERROR HANDLERS or JOI VALIDATION
app.use((err, req, res, next) => {
    err.statusCode = err.statusCode || 500;
    res.status(err.statusCode).send(err.message);
  });

module.exports = app;
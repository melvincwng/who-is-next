const express = require("express");
const app = express();
app.use(express.json());

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

app.get("/", (req, res, next) => {
    res.status(200).send(objectz);
    next(err);
})

app.use((err, req, res, next) => {
    err.statusCode = err.statusCode || 500;
    res.status(err.statusCode).send(err.message);
  });

module.exports = app;
const express = require("express");
const app = express();
app.use(express.json());
// app.js
const cookieParser = require("cookie-parser");
app.use(cookieParser());
require("dotenv").config();

//ROUTERS
const jumplingsRouter = require("../src/routes/jumplings.routes");
const usersRouter = require("../src/routes/users.routes")
app.use("/jumplings", jumplingsRouter);
app.use("/users", usersRouter);

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

//ROUTES
app.get("/", (req, res) => {
    res.status(200).json(object);
});

//ERROR HANDLERS
app.use((err, req, res, next) => {
    err.statusCode = err.statusCode || 500;
    res.status(err.statusCode).send(err.message);
  });

module.exports = app;
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
    res.status(200).json(object);
});

app.get("/jumplings", (req, res) => {
    res.status(200).json(jumplings);
});

app.post("/jumplings", (req, res) => {
    let newJumpling = {
        id: jumplings.length + 1,
        name: req.body.name
    };

    jumplings.push(newJumpling);
    res.status(201).json(newJumpling)
});

app.get("/jumplings/:name", (req, res)=> {
    let selectedJumpling = jumplings.find((jumpling) => jumpling.name === req.params.name);
    res.status(200).json(selectedJumpling);
})

app.put("/jumplings/:id", (req, res) => {
    let selectedJumpling = jumplings.find((jumpling) => jumpling.id === parseInt(req.params.id)); //req.params.id is a string (i.e "1"), hence need to parseInt()
    selectedJumpling.name = req.body.name;
    res.status(200).json(selectedJumpling);
})

app.delete("/jumplings/:id", (req, res) => {
    let selectedJumpling = jumplings.find((jumpling) => jumpling.id === parseInt(req.params.id));
    let index = jumplings.indexOf(selectedJumpling);
    jumplings.splice(index, 1);
    res.status(200).json(selectedJumpling);
})

// ERROR HANDLERS or JOI VALIDATION
app.use((err, req, res, next) => {
    err.statusCode = err.statusCode || 500;
    res.status(err.statusCode).send(err.message);
  });

module.exports = app;
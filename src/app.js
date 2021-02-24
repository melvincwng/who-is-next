const express = require("express");
const app = express();
app.use(express.json());

//1) DATA
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
const jumplings2  = [ // specific array created for question 6
    { id: 1, name: "XXX" },
    { id: 2, name: "YYY"},
    { id: 3, name: "ZZZ"}
];

// 2) MIDDLEWARE LIKE PARAMS PROCESSING OR JSON-REQUIRING MIDDLEWARE
const requireJsonContent = (req, res, next) => {
    if (req.headers["content-type"] !== "application/json") {
      res.status(400).send("Server wants application/json!");
    } else {
      next();
    }
  };

app.param("id", (req, res, next, id) => {
  // do whatever you like with the id, e.g. looking for a particular jumpling person object
  // you can put selectedJumpling object inside the request object
  // req.params.id is a string (i.e "1"), hence need to parseInt()
  let selectedJumpling = jumplings.find((jumpling) => jumpling.id === parseInt(req.params.id)); 
  req.selectedJumpling = selectedJumpling;
  next();
});

app.param("name", (req, res, next, id) => {
    let selectedJumplingByName = jumplings.find((jumpling) => jumpling.name === req.params.name);
    req.selectedJumplingByName = selectedJumplingByName;
    next();
  });

// 3) ROUTES
app.get("/", (req, res) => {
    res.status(200).json(object);
});

app.get("/jumplings", (req, res) => {
    res.status(200).json(jumplings);
});

app.post("/jumplings", requireJsonContent, (req, res) => {
    let newJumpling = {
        id: jumplings.length + 1,
        name: req.body.name
    };

    jumplings.push(newJumpling);
    res.status(201).json(newJumpling)
});

// this answer line 43 - 51 is for question 6 => however since /presenter will clash with /:name => the machine will see 'presenter' as a 'name', hence need to put above name to detect it
app.get("/jumplings/presenter", (req, res) => {
    let randomNumberIndex = Math.floor(Math.random() * (jumplings2.length)) + 1; //generate a random number from 1 to 3
    let selectedJumpling = jumplings2.find((jumpling) => jumpling.id === randomNumberIndex)
    res.status(200).json(selectedJumpling)
})

app.get("/jumplings/:name", (req, res)=> {
    res.status(200).json(req.selectedJumplingByName);
})

app.put("/jumplings/:id", requireJsonContent, (req, res) => {
    req.selectedJumpling.name = req.body.name;
    res.status(200).json(req.selectedJumpling);
})

app.delete("/jumplings/:id", (req, res) => {
    let index = jumplings.indexOf(req.selectedJumpling);
    jumplings.splice(index, 1);
    res.status(200).json(req.selectedJumpling);
})

// 4) ERROR HANDLERS or JOI VALIDATION
app.use((err, req, res, next) => {
    err.statusCode = err.statusCode || 500;
    res.status(err.statusCode).send(err.message);
  });

module.exports = app;
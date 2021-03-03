const express = require("express");
const router = express.Router();
const Jumpling = require('../models/jumpling.model');
// const Joi = require("joi");

//1) DATA
// Since using Jumpling model, these data can be deleted
/* const jumplings = [];
const jumplings2  = [ // specific array created for question 6
    { id: 1, name: "XXX" },
    { id: 2, name: "YYY"},
    { id: 3, name: "ZZZ"}
]; */

// JOI VALIDATION (FOR POST & PUT REQUESTS ONLY) - REMOVED; AS USING MONGOOSE VALIDATION
/* function validateJumpling(jumpling) {
  const schema = Joi.object({
    id: Joi.number().integer(),
    name: Joi.string().min(3).required()
  });
  return schema.validate(jumpling);
} */

// 2) MIDDLEWARE LIKE PARAMS PROCESSING OR JSON-REQUIRING MIDDLEWARE
const requireJsonContent = (req, res, next) => {
    if (req.headers["content-type"] !== "application/json") {
      res.status(400).send("Server wants application/json!");
    } else {
      next();
    }
  };

router.param("id", (req, res, next, id) => {
  // do whatever you like with the id, e.g. looking for a particular jumpling person object
  // you can put selectedJumpling object inside the request object
  // req.params.id is a string (i.e "1"), hence need to parseInt()
  let selectedJumpling = jumplings.find((jumpling) => jumpling.id === parseInt(req.params.id)); 
  req.selectedJumpling = selectedJumpling;
  next();
});

router.param("name", (req, res, next, id) => {
    let selectedJumplingByName = jumplings.find((jumpling) => jumpling.name === req.params.name);
    req.selectedJumplingByName = selectedJumplingByName;
    next();
  });

// 3) ROUTES
router.get("/", async (req, res, next) => {
    try {
      const jumplings = await Jumpling.find({});
      res.status(200).json(jumplings)
    } catch (err) {
      next(err);
    }
});

router.post("/", requireJsonContent, async (req, res, next) => { // dont forget put next here
    try {
      let newJumpling = {
        name: req.body.name
      };
      let jumpling = await new Jumpling(req.body);
      jumpling = await jumpling.save();
      res.status(201).json(jumpling);
    } catch (err) {
      next(err);
    }

    /* let newJumpling = {
        id: jumplings.length + 1,
        name: req.body.name
    }; */

    // JOI VALIDATION DELETED
    /* const validation = validateJumpling(req.body);
    if (validation.error) {
      const error = new Error(validation.error.details[0].message); //validation.errors.details returns an array with 1 object at index 0, that object has message property -> returns a string message
      // 400 Bad Request
      error.statusCode = 400;
      next(error);
    } else {
        jumplings.push(newJumpling);
        res.status(201).json(newJumpling)
    } */
});

// this answer line 43 - 51 is for question 6 => however since /presenter will clash with /:name => the machine will see 'presenter' as a 'name', hence need to put above name to detect it
router.get("/presenter", (req, res) => {
    let randomNumberIndex = Math.floor(Math.random() * (jumplings2.length)) + 1; //generate a random number from 1 to 3
    let selectedJumpling = jumplings2.find((jumpling) => jumpling.id === randomNumberIndex)
    res.status(200).json(selectedJumpling)
})

router.get("/:name", (req, res)=> {
    res.status(200).json(req.selectedJumplingByName);
})

router.put("/:id", requireJsonContent, (req, res, next) => {


    // JOI VALIDATION DELETED
    /* const validation = validateJumpling(req.body);
    if (validation.error) {
      const error = new Error(validation.error.details[0].message); //validation.errors.details returns an array with 1 object at index 0, that object has message property -> returns a string message
      // 400 Bad Request
      error.statusCode = 400;
      next(error);
      } else {
          req.selectedJumpling.name = req.body.name;
          res.status(200).json(req.selectedJumpling);
      } */
})

router.delete("/:id", (req, res) => {
    let index = jumplings.indexOf(req.selectedJumpling);
    jumplings.splice(index, 1);
    res.status(200).json(req.selectedJumpling);
})

module.exports = router;
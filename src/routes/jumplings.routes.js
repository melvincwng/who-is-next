const express = require("express");
const router = express.Router();
const Jumpling = require('../models/jumpling.model');
const protectRoute = require("../../middleware/protectRoute");
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


router.param("id", async (req, res, next, id) => {
  try {
    const selectedJumpling = await Jumpling.findById(req.params.id);
    req.selectedJumpling = selectedJumpling;
    next();
  } catch (err) {
      next(err);
  }
}); 

router.param("name", async (req, res, next, name) => {
    try {
      const jumplings = await Jumpling.find({}); //find all the documents in the model, and it will be stored in an array
      let selectedJumplingByName = jumplings.find((jumpling) => jumpling.name === req.params.name);
      req.selectedJumplingByName = selectedJumplingByName;
      next();
    } catch (err) {
        next(err);
    }
    //let selectedJumplingByName = jumplings.find((jumpling) => jumpling.name === req.params.name);
    //req.selectedJumplingByName = selectedJumplingByName;
    //next();
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

router.post("/", requireJsonContent, protectRoute, async (req, res, next) => { // dont forget put next here
    try {
      const jumpling = await new Jumpling(req.body);
      const newJumpling = await jumpling.save();
      res.status(201).json(newJumpling);
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

// StackOverFlow how to select random jumpling document from the Jumpling Model/Collection: https://stackoverflow.com/questions/14644545/random-document-from-a-collection-in-mongoose
router.get("/presenter", async (req, res) => {
    await Jumpling.countDocuments({}).exec(function (err, count) {
      let randomNumber = Math.floor(Math.random() * (count)); //generate a random number from 0 to 2
      Jumpling.findOne().skip(randomNumber).exec(function (err, result) {
          res.status(200).json(result) //result will contain the randomly selected jumpling document
      })
      
    });
    // this answer line 43 - 51 is for question 6 => however since /presenter will clash with /:name => the machine will see 'presenter' as a 'name', hence need to put above name to detect it
    /* let randomNumberIndex = Math.floor(Math.random() * (jumplings2.length)) + 1; //generate a random number from 1 to 3
    let selectedJumpling = jumplings2.find((jumpling) => jumpling.id === randomNumberIndex)
    res.status(200).json(selectedJumpling) */
})

router.get("/:name", async (req, res)=> {
    res.status(200).json(req.selectedJumplingByName);
})

// this function is obsolete since first we no longer hardcode the id in the individual jumpling object
/* router.get("/:id", async (req, res)=> {
  res.status(200).json(req.selectedJumpling);
}) */

router.put("/:id", requireJsonContent, protectRoute, async (req, res, next) => {
    try {
      const jumpling = await Jumpling.findByIdAndUpdate(req.selectedJumpling._id, req.body, {new: true, runValidators:true}); // In the Jumpling model, find an instance/document with that ID, and update it with the 2nd parameters. Jumpling model contains all your model instances/documents
      res.status(200).json(jumpling);
    } catch (err) {
        next(err);
    }
    
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

router.delete("/:id", protectRoute, async (req, res, next) => {
  try {
    const deletedJumpling = await Jumpling.findByIdAndDelete(req.selectedJumpling._id);
    res.status(200).json(deletedJumpling)

  } catch (err) {
    next(err)
  }
    //let index = jumplings.indexOf(req.selectedJumpling);
    //jumplings.splice(index, 1);
    //res.status(200).json(req.selectedJumpling);
})

module.exports = router;
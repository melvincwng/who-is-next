const mongoose = require("mongoose");
const Schema = mongoose.Schema

const jumplingSchema = new Schema({
    name: {
      type: String,
      required: true,
      minlength: 3,
      unique: true,
    },
  });
  
const Jumpling = mongoose.model("Jumpling", jumplingSchema);

module.exports = Jumpling;
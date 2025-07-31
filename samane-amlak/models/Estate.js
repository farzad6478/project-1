const mongoose = require('mongoose');

const estateSchema = new mongoose.Schema({
  title: String,
  location: String,
  yearBuilt: String,
  floor: String,
  bedrooms: String,
  directionOne: String,
  directionTwo: String,
  unitsCount: String,
  price: String,
  description: String,
  date: {
    type: Date,
    default: Date.now
  }
});

module.exports = mongoose.model('Estate', estateSchema);
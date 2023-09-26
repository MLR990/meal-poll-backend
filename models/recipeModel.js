const mongoose = require('mongoose');

const recipeSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'A recipe must have a name'],
    unique: true,
  },
  rating: {
    type: Number,
    default: 4,
  },
  description: String,
});

const Recipe = mongoose.model('Recipe', recipeSchema);

module.exports = Recipe;
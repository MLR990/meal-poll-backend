const mongoose = require('mongoose');
const slugify = require('slugify');
const Recipe = require('./recipeModel');

const householdSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'A household must have a name'],
  },
  members: [{ type: mongoose.Schema.ObjectId, ref: 'User' }],
  recipes: Array,
});

householdSchema.pre(/^find/, function (next) {
  this.populate({
    path: 'members',
    select:
      '-__v -passwordChangedAt -passwordResetToken -passwordResetExpires -active',
  });
  next();
});

householdSchema.pre('save', function (next) {
  this.slug = slugify(this.name, { lower: true });
  next();
});
householdSchema.pre('save', async function (next) {
  const recipePromises = this.recipes.map(
    async (id) => await Recipe.findById(id),
  );

  this.recipes = await Promise.all(recipePromises);
  next();
});

const Household = mongoose.model('Household', householdSchema);

module.exports = Household;

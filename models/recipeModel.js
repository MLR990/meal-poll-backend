const mongoose = require('mongoose');
const slugify = require('slugify');
const validator = require('validator');

const recipeSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, 'A recipe must have a name'],
      unique: true,
      maxLength: [40, 'A recipe name cannot have more than 40 characters'],
      minLength: [5, 'A recipe name must have at least 5 characters'],
      // validate: [
      //   validator.isAlpha,
      //   'Recipe name must only contain characteres',
      // ],  Does not work with spaces so just keeping for memory
    },
    slug: String,
    mealType: {
      type: String,
      required: [true, 'A recipe must have a category'],
      enum: {
        values: ['Pasta', 'Chicken', 'Beef', 'Pork', 'Other'],
        message: 'Recipe must be in a pre defined category',
      },
    },
    rating: {
      type: Number,
      default: 4,
      min: [1, 'Rating cannot be lower than 1'],
      max: [10, 'Rating must be 10 or below'],
    },
    price: Number,
    priceDiscount: {
      type: Number,
      validate: {
        validator: function (val) {
          return val < this.price; //the 'this' only works on a new document.  Will not work on an update
        },
        message: 'Discount price ({VALUE}) should be below regular price',
      },
    },
    secretRecipe: {
      type: Boolean,
      default: false,
    },
    createdAt: {
      type: Date,
      default: Date.now(),
      select: false,
    },
    description: String,
  },
  {
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
  },
);

recipeSchema.virtual('rating100').get(function () {
  return this.rating * 10;
});

// document middleware runs before save and create NOT insertMany
recipeSchema.pre('save', function (next) {
  this.slug = slugify(this.name, { lower: true });
  next();
});

// recipeSchema.post('save', (doc, next) => {
//   console.log(doc);
//   next();
// });

//QUERY MIDDLEWARE
recipeSchema.pre(/^find/, function (next) {
  this.find({ secretRecipe: { $ne: true } });
  this.start = Date.now();
  next();
});
recipeSchema.post(/^find/, function (docs, next) {
  console.log(`Query Took: ${Date.now() - this.start} milliseconds`);
  next();
});

//AGGREGATION MIDDLEWARE
recipeSchema.pre('aggregate', function (next) {
  this.pipeline().unshift({ $match: { secretRecipe: { $ne: true } } });
  next();
});
const Recipe = mongoose.model('Recipe', recipeSchema);

module.exports = Recipe;

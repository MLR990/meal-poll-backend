const Recipe = require('../models/recipeModel');
const APIFeatures = require('../utils/apiFeatures');
const AppError = require('../utils/appError');
const catchAsync = require('../utils/catchAsync');

exports.aliasFamilyFaves = (req, res, next) => {
  req.query.limit = '5';
  req.query.sort = '-rating,name';
  req.query.fields = 'name,description';
  next();
};

exports.getAllRecipes = catchAsync(async (req, res, next) => {
  const results = new APIFeatures(Recipe.find(), req.query)
    .filter()
    .sort()
    .limitFields()
    .paginate();
  const recipes = await results.query;

  //send response
  res.status(200).json({
    status: 'success',
    requestedAt: req.requestTime,
    results: recipes.length,
    data: {
      recipes,
    },
  });
});

exports.getRecipe = catchAsync(async (req, res, next) => {
  const recipe = await Recipe.findById(req.params.id);

  if (!recipe) {
    return next(new AppError('No recipe found with that ID.', 404));
  }

  res.status(200).json({
    status: 'success',
    requestedAt: req.requestTime,
    data: {
      recipe,
    },
  });
});

exports.createRecipe = catchAsync(async (req, res, next) => {
  const newRecipe = await Recipe.create(req.body);

  res.status(201).json({
    status: 'success',
    data: { recipe: newRecipe },
  });
});

exports.updateRecipe = catchAsync(async (req, res, next) => {
  const recipe = await Recipe.findByIdAndUpdate(req.params.id, req.body, {
    new: true,
    runValidators: true,
  });

  if (!recipe) {
    return next(new AppError('No recipe found with that ID.', 404));
  }

  res.status(200).json({
    status: 'success',
    data: { recipe },
  });
});

exports.deleteRecipe = catchAsync(async (req, res, next) => {
  const recipe = await Recipe.findByIdAndDelete(req.params.id);

  if (!recipe) {
    return next(new AppError('No recipe found with that ID.', 404));
  }

  res.status(204).json({
    status: 'success',
    data: null,
  });
});

exports.getRecipeStats = catchAsync(async (req, res, next) => {
  const stats = await Recipe.aggregate([
    // {
    //   $match: { rating: { $gte: 2 } },
    // },
    {
      $group: {
        _id: { $toUpper: '$mealType' },
        numRecipes: { $sum: 1 },
        avgRating: { $avg: '$rating' },
        minRating: { $min: '$rating' },
        maxRating: { $max: '$rating' },
      },
    },
    {
      $sort: {
        avgRating: -1,
      },
    },
    // {
    //   $match: {
    //     _id: { $ne: 'FISH' },
    //   },
    // },
  ]);
  res.status(200).json({
    status: 'success',
    data: { stats },
  });
});

// exports.getMonthlyPlan = async (req, res, next) => {
//   try {
//     const year = req.params.year * 1; // 2021

//     const plan = await Tour.aggregate([
//       {
//         $unwind: '$startDates',
//       },
//       {
//         $match: {
//           startDates: {
//             $gte: new Date(`${year}-01-01`),
//             $lte: new Date(`${year}-12-31`),
//           },
//         },
//       },
//       {
//         $group: {
//           _id: { $month: '$startDates' },
//           numTourStarts: { $sum: 1 },
//           tours: { $push: '$name' },
//         },
//       },
//       {
//         $addFields: { month: '$_id' },
//       },
//       {
//         $project: {
//           _id: 0,
//         },
//       },
//       {
//         $sort: { numTourStarts: -1 },
//       },
//       {
//         $limit: 12,
//       },
//     ]);

//     res.status(200).json({
//       status: 'success',
//       data: {
//         plan,
//       },
//     });
//   } catch (err) {
//     res.status(404).json({
//       status: 'fail',
//       message: err,
//     });
//   }
// };

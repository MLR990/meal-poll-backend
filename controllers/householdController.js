const Household = require('../models/householdModel');
const APIFeatures = require('../utils/apiFeatures');
const AppError = require('../utils/appError');
const catchAsync = require('../utils/catchAsync');

//CREATE
exports.createHousehold = catchAsync(async (req, res, next) => {
  const newHousehold = await Household.create(req.body);

  res.status(201).json({
    status: 'success',
    data: { household: newHousehold },
  });
});

//READ
exports.getHousehold = catchAsync(async (req, res, next) => {
  const household = await Household.findById(req.params.id);

  if (!household) {
    return next(new AppError('No Household found with that ID.', 404));
  }

  res.status(200).json({
    status: 'success',
    requestedAt: req.requestTime,
    data: {
      household,
    },
  });
});

exports.getAllHouseholds = catchAsync(async (req, res, next) => {
  const results = new APIFeatures(Household.find(), req.query)
    .filter()
    .sort()
    .limitFields()
    .paginate();
  const Households = await results.query;

  //send response
  res.status(200).json({
    status: 'success',
    requestedAt: req.requestTime,
    results: Households.length,
    data: {
      Households,
    },
  });
});

//UPDATE
exports.updateHousehold = catchAsync(async (req, res, next) => {
  const household = await Household.findByIdAndUpdate(req.params.id, req.body, {
    new: true,
    runValidators: true,
  });

  if (!household) {
    return next(new AppError('No household found with that ID.', 404));
  }

  res.status(200).json({
    status: 'success',
    data: { household },
  });
});

//DELETE
exports.deleteHousehold = catchAsync(async (req, res, next) => {
  const household = await Household.findByIdAndDelete(req.params.id);

  if (!household) {
    return next(new AppError('No household found with that ID.', 404));
  }

  res.status(204).json({
    status: 'success',
    data: null,
  });
});

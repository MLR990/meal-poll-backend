const express = require('express');
const householdController = require('../controllers/householdController');
const authController = require('../controllers/authController');

const router = express.Router();

router
  .route('/')
  .get(authController.protect, householdController.getAllHouseholds)
  .post(householdController.createHousehold);

router
  .route('/:id')
  .get(householdController.getHousehold)
  .patch(householdController.updateHousehold)
  .delete(
    authController.protect,
    authController.restrictTo('admin'),
    householdController.deleteHousehold,
  );
module.exports = router;

const express = require('express');
const recipeController = require('../controllers/recipeController');
const authController = require('../controllers/authController');

const router = express.Router();

// router.param('id', tourController.checkID);

router
  .route('/family-favorites')
  .get(recipeController.aliasFamilyFaves, recipeController.getAllRecipes);
router.route('/recipe-stats').get(recipeController.getRecipeStats);

router
  .route('/')
  .get(recipeController.getAllRecipes)
  .post(recipeController.createRecipe);

router
  .route('/:id')
  .get(recipeController.getRecipe)
  .patch(recipeController.updateRecipe)
  .delete(
    authController.protect,
    authController.restrictTo('admin'),
    recipeController.deleteRecipe,
  );

module.exports = router;

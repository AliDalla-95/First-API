const express = require('express');

const { getCategories, addCategory, deleteCategory, deleteAllCategories, updateCategory,  getCategory} = require('../services/categoryService');

const router = express.Router();

const {
    getCategoryValidator,
    createCategoryValidator,
    updateCategoryValidator,
    deleteCategoryValidator,
  } = require('../utils/validators/categoryValidator');
  

// DELETE: Delete all categories
router.delete('/all', deleteAllCategories);  // This will handle DELETE requests to /api/v1/categories/all



// GET: Retrieve all categories
router.get('/', getCategories);

// POST: Add a new category
router.route('/').post(createCategoryValidator, addCategory);


// DELETE: Delete category by ID
router.delete('/:id',deleteCategoryValidator, deleteCategory);  // :id will capture the category ID from the URL

//get category or update category by id category
router.route('/:id').get(getCategoryValidator, getCategory).put(updateCategoryValidator, updateCategory);


module.exports = router;
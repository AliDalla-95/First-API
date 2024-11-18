// services/categoryService.js
const slugify = require('slugify');
const CategoryModel = require('../models/categoryModel');
const asyncHandler = require('express-async-handler');
const ApiError = require('../utils/apiError');
// exports.getCategories = (req, res) => {
//   const name = req.body.name;
//   console.log(req.body);

//   const newCategory = new CategoryModel({ name });
//   newCategory
//     .save()
//     .then((doc) => {
//       res.json(doc);
//     })
//     .catch((err) => {
//       res.json(err);
//     });
// };

//// Get all categories (GET)
exports.getCategories = asyncHandler(async (req, res) => {
    // Fetch all categories from the database
    const page = req.query.page * 1 || 1;
    const limit = req.query.limit * 1 || 5;
    const skip = (page - 1) * limit;
    const categories = await CategoryModel.find({}).skip(skip).limit(limit);
    res.status(200).json({ msg: 'Categories fetched successfully!', data: categories });
  });

// Add a new category (POST)
exports.addCategory = (req, res) => {
    const { name } = req.body;
  
    // Ensure a category name is provided
    if (!name) {
      return res.status(400).json({ msg: 'Category name is required' });
    }
  
    const newCategory = new CategoryModel({ name, slug: slugify(name) });
  
    // Save the new category
    newCategory
      .save()
      .then((doc) => {
        res.status(201).json({ msg: 'Category created successfully!', data: doc });
      })
      .catch((err) => {
        res.status(500).json({ msg: 'Error saving category', error: err });
      });
  };



// Delete category by ID
exports.deleteCategory = (req, res) => {
  const categoryId = req.params.id;

  // Validate that the ID is provided
  if (!categoryId) {
    return res.status(400).json({ message: 'Category ID is required' });
  }

  // Find and delete the category by ID
  CategoryModel.findByIdAndDelete(categoryId)
    .then((deletedCategory) => {
      if (!deletedCategory) {
        return res.status(404).json({ message: 'Category not found' });
      }
      res.status(200).json({
        message: 'Category deleted successfully',
        data: deletedCategory
      });
    })
    .catch((err) => {
      res.status(500).json({
        message: 'Error deleting category',
        error: err
      });
    });
};


// Delete all categories
exports.deleteAllCategories = (req, res) => {
    CategoryModel.deleteMany({})
      .then((result) => {
        res.status(200).json({
          message: 'All categories deleted successfully',
          data: result
        });
      })
      .catch((err) => {
        console.error("Error deleting categories:", err); // Log the error for debugging
        res.status(500).json({
          message: 'Error deleting all categories',
          error: err.message || err // Send a more detailed error message
        });
      });
  };


exports.getCategory = asyncHandler(async (req, res) => {
    const { id } = req.params;
    const category = await CategoryModel.findById(id);
    if (!category) {
      res.status(404).json({ msg: `No category for this id ${id}` });
    }
    res.status(200).json({ data: category });
});


exports.updateCategory = asyncHandler(async (req, res) => {
    const { id } = req.params;
    const { name } = req.body;
  
    const category = await CategoryModel.findOneAndUpdate(
      { _id: id },
      { name, slug: slugify(name) },
      { new: true }
    );
  
    if (!category) {
      res.status(404).json({ msg: `No category for this id ${id}` });
    }
    res.status(200).json({ data: category });
  });
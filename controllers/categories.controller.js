const Category = require('../models/category.schema');

// add new category
exports.addCategory = async (req, res) => {
  // check if category name input exists already
  Category.find({ name: req.body.name }, function (err, results) {
    if (results.length) {
      res.status(402).json({
        message: 'Failed',
        data: { errorMessage: 'A category with the same name exists already!' },
      });
    }
  });
  try {
    const newCategory = new Category({
      name: req.body.name,
      description: req.body.description,
      icon: req.body.icon,
      category_cover_image: req.body.category_cover_image,
    });
    const category = await newCategory.save();

    res.status(201).json({
      message: 'success',
      data: category,
    });
  } catch (error) {
    console.log(error);
    res.status(400).json({
      message: 'Failed',
      data: { errorMessage: 'Some error occurred while add this new category' },
    });
  }
};

// Retrieve all categories
exports.allCategories = async (req, res) => {
  Category.find()
    .then((data) => {
      res.send(data);
      console.log(data);
    })
    .catch((err) => {
      res.status(500).json({
        message: 'Failed',
        data: {
          errorMessage: 'Some error occurred while retrieving categories.',
        },
      });
    });
};

// Update a category record
exports.updateOneCategory = async (req, res) => {
  //check if it is  a valid ID
  const found = await Category.findById(req.params.id);
  if (!found) {
    res.status(402).json({
      message: 'Failed',
      data: { errorMessage: 'There is no category with such an ID!' },
    });
  }
  const category = new Category({
    _id: req.params.id,
    name: req.body.name,
    description: req.body.description,
    icon: req.body.icon,
    category_cover_image: req.body.category_cover_image,
  });
  Category.updateOne({ _id: req.params.id }, category)
    .then(() => {
      res.status(201).json({
        message: 'success',
        data: category,
      });
    })
    .catch(() => {
      res.status(400).json({
        message: 'Failed',
        data: {
          errorMessage: 'Some error occurred while update process',
        },
      });
    });
};

// Delete one category by id
exports.deleteOneCategory = async (req, res) => {
  const { id } = req.params;
  const foundCategory = await Category.findOne({ _id: id });
  if (foundCategory || foundCategory.length == 0) {
    const response = await foundCategory.deleteOne({ _id: id });
    res.status(202).json({ message: 'Success', data: response });
  } else {
    res.status(404).json({
      message: 'Failed',
      data: {
        errorMessage: 'Some error occured while deleting this Category!',
      },
    });
  }
};
// find category by id
exports.findCategoryById = async (req, res) => {
  try {
    const categoryDoesExist = await Category.findOne({ _id: req.params.id });
    console.log(categoryDoesExist);
    res.status(202).json({ message: 'Success', data: categoryDoesExist });
  } catch (error) {
    res.status(404).json({
      message: 'Failed',
      data: {
        errorMessage: 'Some error occured while fetching this category!',
      },
    });
  }
};

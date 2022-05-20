const CategoryModel = require('../models/Category.schema');
const {
  display_costume_error,
} = require('../global_functions/display_costume_error');
const {
  display_error_message,
} = require('../global_functions/display_error_message');
const validator = require('../middleware/validatorRequiredData');
const mongoose = require('mongoose');

exports.addCategory = (req, res) => {
  const { description, name } = req.body;
  if (validator(req.body, ['description', 'name'], res)) {
    return;
  }
  try {
    const category = new CategoryModel({
      name,
      description,
    });
    category
      .save()
      .then(() => {
        res.status(res.statusCode).json({
          message: 'product category added successfully !',
        });
      })
      .catch((error) => {
        display_error_message(res, error);
      });
  } catch (error) {
    display_error_message(res, error);
  }
};
exports.updateCategory = (req, res) => {
  if (validator(req.body, ['_id'], res)) {
    return;
  }
  const { _id, name, description } = req.body;
  const params = { _id, name, description };
  for (const prop in params) if (!params[prop]) delete params[prop];
  CategoryModel.findOneAndUpdate(
    { _id: mongoose.Types.ObjectId(req.body._id) },
    { $set: params },
    { new: true }
  )
    .exec()
    .then((data) => {
      if (data === null) {
        display_costume_error(res, 'Category id not found', 404);
      } else {
        res.status(res.statusCode).json({
          message: 'category  data was updated',
        });
      }
    })
    .catch((error) => {
      display_error_message(res, error);
    });
};
exports.deleteCategory = (req, res) => {
  if (validator(req.body, ['_id'], res)) {
    return;
  }
  CategoryModel.remove({ _id: mongoose.Types.ObjectId(req.body._id) })
    .exec()
    .then((data) => {
      if (data.deletedCount === 0) {
        display_costume_error(res, 'category _id not found', 404);
      } else {
        res.status(res.statusCode).json({
          message: 'category was deleted',
        });
      }
    })
    .catch((error) => {
      display_error_message(res, error);
    });
};
exports.getAllCategory = (req, res) => {
  CategoryModel.find({})
    .exec()
    .then((data) => {
      res.status(res.statusCode).json({
        data,
      });
    })
    .catch((error) => {
      display_error_message(res, error);
    });
};

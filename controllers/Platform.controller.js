const PlatformModel = require('../models/Platform.schema');
const {
  display_costume_error,
} = require('../global_functions/display_costume_error');
const {
  display_error_message,
} = require('../global_functions/display_error_message');
const validator = require('../middleware/validatorRequiredData');
const mongoose = require('mongoose');

exports.addPlatform = (req, res) => {
  const { description, name } = req.body;
  if (validator(req.body, ['description', 'name'], res)) {
    return;
  }
  try {
    const Platform = new PlatformModel({
      name,
      description,
    });
    Platform.save()
      .then(() => {
        res.status(res.statusCode).json({
          message: 'product Platform added successfully !',
        });
      })
      .catch((error) => {
        display_error_message(res, error);
      });
  } catch (error) {
    display_error_message(res, error);
  }
};

exports.updatePlatform = (req, res) => {
  if (validator(req.body, ['_id'], res)) {
    return;
  }
  const { _id, name, description } = req.body;
  const params = { _id, name, description };
  for (const prop in params) if (!params[prop]) delete params[prop];
  PlatformModel.findOneAndUpdate(
    { _id: mongoose.Types.ObjectId(req.body._id) },
    { $set: params },
    { new: true }
  )
    .exec()
    .then((data) => {
      if (data === null) {
        display_costume_error(res, 'Platform id not found', 404);
      } else {
        res.status(res.statusCode).json({
          message: 'Platform  data was updated',
        });
      }
    })
    .catch((error) => {
      display_error_message(res, error);
    });
};

exports.deletePlatform = (req, res) => {
  if (validator(req.body, ['_id'], res)) {
    return;
  }
  PlatformModel.remove({ _id: mongoose.Types.ObjectId(req.body._id) })
    .exec()
    .then((data) => {
      if (data.deletedCount === 0) {
        display_costume_error(res, 'Platform _id not found', 404);
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

exports.getAllPlatform = (req, res) => {
  PlatformModel.find({})
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

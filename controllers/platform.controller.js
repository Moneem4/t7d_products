const PlatformModel = require('../models/platform.schema');
const {display_costume_error} = require('../global_functions/display_costume_error');
const {display_error_message} = require('../global_functions/display_error_message');
const validator = require('../middleware/validatorRequiredData');
const mongoose = require('mongoose');
const {s3delete} = require('../global_functions/s3delete')

exports.addPlatform = (req, res) => {
  const { description, name } = req.body;
  if (validator(req.body, ['description', 'name'], res)) {
    return;
  }
    if (req.file === undefined) {
        res.status(res.statusCode).json({
        error: true,
        message: 'icon was required',
        })
        return
    }
  try {
    const Platform = new PlatformModel({
      name,
      description,
      icon: req.file.location

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
  const params = { _id, name, description,icon: req.file !== undefined ? req.file.location : undefined  };
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
            if (req.file !== undefined) {
                    s3delete(data.icon);   
            }
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

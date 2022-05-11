const GameCategory = require('../models/game.category.schema');

// add a new game category
exports.addGameCategory = async (req, res) => {
  // check if category game name input exists already
  GameCategory.find({ name: req.body.name }, function (err, results) {
    if (results.length) {
      res.status(402).json({
        message: 'Failed',
        data: {
          errorMessage: 'A game category with the same name exists already!',
        },
      });
    }
  });
  try {
    const newGameCategory = new GameCategory({
      name: req.body.name,
      description: req.body.description,
      icon: req.body.icon,
    });
    const game_category = await newGameCategory.save();

    res.status(201).json({
      message: 'success',
      data: game_category,
    });
  } catch (error) {
    console.log(error);
    res.status(400).json({
      message: 'Failed',
      data: {
        errorMessage: 'Some error occurred while add this new game category',
      },
    });
  }
};

// get all  games categories
exports.allGamesCategories = async (req, res) => {
  GameCategory.find()
    .then((data) => {
      res.status(200).json({ message: 'success', data: data });
      console.log(data);
    })
    .catch((err) => {
      res.status(500).send({
        message: err.message,
        data: 'Some error occurred while retrieving games categories.',
      });
    });
};

// Update a game category record
exports.updateOneGameCategory = async (req, res) => {
  // check if there is a game category with such ID
  const found = await GameCategory.findById(req.params.id);
  if (!found) {
    res.status(402).json({
      message: 'Failed',
      data: { errorMessage: 'There is no game category with such an ID!' },
    });
  }
  const gamecategory = new GameCategory({
    _id: req.params.id,
    name: req.body.name,
    description: req.body.description,
    icon: req.body.icon,
  });
  GameCategory.updateOne({ _id: req.params.id }, gamecategory)
    .then(() => {
      res.status(201).json({
        message: 'Success',
        data: gamecategory,
      });
      console.log(gamecategory);
    })
    .catch((error) => {
      res.status(400).json({
        message: 'Failed',
        data: {
          errorMessage: 'Some error occurred while updating process!',
        },
      });
    });
};

// Delete one game category by id
exports.deleteOneGameCategory = async (req, res) => {
  const { id } = req.params;
  const foundCategory = await GameCategory.findOne({ _id: id });
  if (foundCategory || foundCategory.length == 0) {
    const response = await foundCategory.deleteOne({ _id: id });
    res.status(200).json({ message: 'success ', data: response });
  } else {
    res.status(404).json({
      message: 'Failed',
      data: { errorMessage: 'Some error occured while delete process!' },
    });
  }
};

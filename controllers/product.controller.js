const GameModel = require("../models/product.schema");

exports.getGames = (req, res) => {
  GameModel.find()
    .sort({ createdAt: -1 })
    .then((games) => {
      res.status(200).json({ message: "Success ", data: games });
    });
};

exports.addGame = async (req, res) => {
  try {
    const newGame = new GameModel(req.body);
    const existantGame = await GameModel.findOne({ title: newGame.title });
    if (!existantGame) {
      await newGame.save();
      res.status(200).json({ message: "Success", data: newGame });
    } else {
      res.status(500).json({
        message: "Failure",
        data: { errorMessage: " with the same title already exist!" },
      });
    }
  } catch (error) {
    console.log(error);
    res.status(400).json({ message: "failed " });
  }
};

exports.getGameById = async (req, res) => {
  GameModel.findOne({ _id: req.params.id }).then((game) => {
    res.status(200).json({ message: "Success ", data: game });
  });
};

exports.searchGame = async (req, res) => {
  try {
    const game = req.body.product;
    const games = await GameModel.find({
      title: { $regex: game, $options: "i" },
    });
    res.status(200).json({ message: "Success", data: games });
  } catch (err) {
    console.log(err);
    res.status(500).json({
      message: "Failure",
      data: { errorMessage: "Internal server error!" },
    });
  }
};

// update one Game
exports.updateOneGame = async (req, res) => {
  try {
    const game = req.body;
    const game_id = req.params.id;

    const g = await GameModel.findById(game_id);
    if (!g)
      res.status(404).json({
        message: "Failure",
        data: { errorMessage: "This game does not exist!" },
      });
    else {
      const updatedGame = await GameModel.findByIdAndUpdate(game_id, game, {
        new: true,
      });
      res.status(200).json({ message: "Success", data: updatedGame });
    }
  } catch (err) {
    console.log(err);
    res.status(500).json({
      message: "Failure",
      data: { errorMessage: "Internal server error!" },
    });
  }
};

// Delete one game by id
exports.deleteOneGame = async (req, res) => {
  const { id } = req.params;
  const foundGame = await GameModel.findOne({ _id: id });
  if (foundGame || foundGame.length == 0) {
    const response = await foundGame.deleteOne({ _id: id });
    res.status(202).json({ message: "success ", data: response });
  } else {
    res.status(404).json({ message: `Failed` });
  }
};

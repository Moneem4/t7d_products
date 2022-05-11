const { default: axios } = require("axios");
const ProductModel = require("../models/giftCard.schema");
const GameModel = require("../models/product.schema");

// add new product
exports.addProduct = async (req, res) => {
  // check if libelle input exists already
  ProductModel.find({ sku: req.body.sku }, function (err, results) {
    console.log(results);
    if (results.length) {
      res.status(402).json({
        message: "Failed",
        data: { errorMessage: "Sku exists already!" },
      });
    }
  });
  try {
    const newProduct = new ProductModel(req.body);
    await newProduct.save();
    res.status(201).json({
      message: "Success ",
      data: newProduct,
    });
  } catch (error) {
    console.log(error);
  }
};

// get all products
exports.allProducts = async (req, res) => {
  ProductModel.find()
    .then((data) => {
      res.status(200).json({ message: "success", data: data });
      console.log(data);
    })
    .catch((err) => {
      res.status(500).send({
        message: err.message,
        data: "Some error occurred while retrieving products.",
      });
    });
};

//Wifek
// Get products filtred by categories
exports.allProductsByCategories = async (req, res) => {
  try {
    let categories = [];
    categories = req.body.categories;
    categories = categories.map((category) => category.toUpperCase());
    const { profile_id } = req.body;

    let freeHotDeals = [];
    let freeMostSoldProducts = [];
    let premuimHotDeals = [];
    let premuimMostSoldProducts = [];
    let allProducts = {};
    let myGames = [];

    // Get the preferred games of the current profile
    const profile = await axios.get(
      process.env.PROFILE_URL + "/findOne/" + profile_id
    );

    const userSurvey = await axios.get(
      "https://survey.galactechstudio.com/surveys/findOneByProfileId/" +
        profile_id
    );

    const merged = userSurvey.data.data.gamesIds.concat(
      profile.data.data.preferred_games
    );
    const userGames = await merged.filter(
      (item, pos) => merged.indexOf(item) == pos
    );
    console.log("userGames", userGames);

    if (categories.length === 0) {
      allProducts = await ProductModel.find().populate("product_id");

      for (const game of userGames) {
        const g = await GameModel.findById(game);
        if (g) myGames.push(g);
      }
    } else {
      allProducts = await ProductModel.find({
        giftCard_categories: { $in: categories },
      }).populate("product_id");
      for (const game of userGames) {
        const g = await GameModel.findOne({
          _id: game,
          giftCard_categories: { $in: categories },
        });
        if (g) myGames.push(g);
      }
    }
    for (const product of allProducts) {
      let type = product.giftCard_type;
      let isHotDeal = product.isHot_deal;

      if (type === "Free") {
        freeMostSoldProducts.push(product);
        if (isHotDeal) freeHotDeals.push(product);
      } else if (type === "Premuim") {
        premuimMostSoldProducts.push(product);
        if (isHotDeal) premuimHotDeals.push(product);
      }
    }
    freeMostSoldProducts.sort((a, b) =>
      a.number_of_purchases <= b.number_of_purchases ? 1 : -1
    );
    premuimMostSoldProducts.sort((a, b) =>
      a.number_of_purchases <= b.number_of_purchases ? 1 : -1
    );
    const products = {
      myGames: myGames,
      Free: { HotDeal: freeHotDeals, MostSoldProducts: freeMostSoldProducts },
      Premuim: {
        HotDeal: premuimHotDeals,
        MostSoldProducts: premuimMostSoldProducts,
      },
    };
    res.status(200).json({ message: "Success", data: products });
  } catch (err) {
    console.log(err);
    res.status(500).json({
      message: "Failure",
      data: { errorMessage: "Internal server error!" },
    });
  }
};

// Get product by game_id
exports.getProductsByGameId = async (req, res) => {
  try {
    const game_id = req.params.gameId;
    const products = await ProductModel.find({ game: game_id }).populate(
      "product_id"
    );
    res.status(200).json({ message: "Success", data: products });
  } catch (err) {
    console.log(err);
    res.status(500).json({
      message: "Failure",
      data: { errorMessage: "Internal server error!" },
    });
  }
};

// Get product by Id
exports.getProductById = async (req, res) => {
  try {
    const product_id = req.params.id;
    const product = await ProductModel.findById(product_id).populate("product_id");
    if (!product)
      res.status(404).json({
        message: "Failure",
        data: { errorMessage: "Product not found!" },
      });
    else res.status(200).json({ message: "Success", data: product });
  } catch (err) {
    console.log(err);
    res.status(500).json({
      message: "Failure",
      data: { errorMessage: "Internal server error!" },
    });
  }
};

exports.searchProduct = async (req, res) => {
  try {
    const product = req.body.product;
    const products = await ProductModel.find({
      name: { $regex: product, $options: "i" },
    });
    res.status(200).json({ message: "Success", data: products });
  } catch (err) {
    console.log(err);
    res.status(500).json({
      message: "Failure",
      data: { errorMessage: "Internal server error!" },
    });
  }
};

// Update a product record
exports.updateOneProduct = async (req, res) => {
  try {
    const product = req.body;
    const product_id = req.params.id;

    const p = await ProductModel.findById(product_id);
    if (!p)
      res.status(404).json({
        message: "Failure",
        data: { errorMessage: "This product does not exist!" },
      });
    else {
      const updatedProduct = await ProductModel.findByIdAndUpdate(
        product_id,
        product,
        { new: true }
      );
      res.status(200).json({ message: "Success", data: updatedProduct });
    }
  } catch (err) {
    console.log(err);
    res.status(500).json({
      message: "Failure",
      data: { errorMessage: "Internal server error!" },
    });
  }
};

// End Wifek

// Delete one product by id
exports.deleteOneProduct = async (req, res) => {
  const { id } = req.params;
  const foundProduct = await ProductModel.findOne({ _id: id });
  if (foundProduct || foundProduct.length == 0) {
    const response = await foundProduct.deleteOne({ _id: id });
    res.status(202).json({ message: "success ", data: response });
  } else {
    res.status(404).json({
      message: `Failed`,
      data: { errorMessage: "There is no product with such an ID!" },
    });
  }
};

// ∅
// 🛠️️

const express = require("express");
const router = express.Router();

const {
  addGame,
  getGames,
  updateOneGame,
  deleteOneGame,
  getGameById,
  searchGame,
} = require("../../controllers/product.controller");

router.post("/addproduct", addGame);
router.get("/getProductById/:id", getGameById);
router.get("/getproducts", getGames);
router.put("/updateOneGame/:id", updateOneGame);
router.get("/deleteOneGame/:id", deleteOneGame);
router.post("/searchproduct", searchGame);
module.exports = router;

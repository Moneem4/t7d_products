require("dotenv").config();
const Products = require("./routes/api/products");
const Category = require("./routes/api/category");
const GiftCard = require("./routes/api/giftCard");
const GameCategory = require("./routes/api/game.category");
const path = require("path");
const ecsFormat = require("@elastic/ecs-morgan-format");
const morgan = require("morgan");
const express = require("express");

const connectDB = require("./config/connectDB");

const cors = require("cors");
const app = express();
//expose assets sufolders
app.use("/static", express.static(path.join(__dirname, "/assets")));
app.use("/assets", express.static("./assets"));
app.use(express.json());

app.use(cors());

app.use(require("cookie-parser")());

app.use(require("body-parser").urlencoded({ extended: true }));
app.use(morgan(ecsFormat({ format: "tiny" })));
app.use(
  require("express-session")({
    secret: "secret",
    resave: true,
    saveUninitialized: true,
  })
);
app.use("/gamescategories", GameCategory);
app.use("/products", Products);
app.use("/categories", Category);
app.use("/giftCards", GiftCard);

const PORT = process.env.PORT || 3000;

connectDB();

app.listen(PORT, () => {
  console.log(`Products service listning on port ${PORT}`);
});

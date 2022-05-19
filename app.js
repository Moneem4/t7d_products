require("dotenv").config();
const Products = require("./routes/products");
const Category = require("./routes/category");
//const GiftCard = require("./routes/giftCard");
const platform = require("./routes/platform");
const morgan = require("morgan");
const express = require("express");
const connectDB = require("./config/connectDB");
const cors = require("cors");
const app = express();



app.use(cors());
connectDB();
app.use(morgan('dev'))
app.use(express.json());
app.use(express.urlencoded({ extended: true }))

//app.use("/gamescategories", GameCategory);
app.use("/products", Products);
app.use("/categories", Category);
app.use("/platform", platform);
app.use((req, res) => {
    res.status(404).json({ error: 'page not found' })
})



const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Products service listning on port ${PORT}`);
});

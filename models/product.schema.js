const mongoose = require("mongoose");

const Schema = mongoose.Schema;

const productSchema = new Schema(
  {
    title: {
      type: String,
      default: "Product name",
    },
    developer: {
      type: String,
      default: "Product studio",
    },
    description: {
      type: String,
      default: "Product description",
    },
    logo: {
      type: String,
      default: "Product logo path",
    },
    display: {
      type: Number,
      default: 0,
    },
    banner: {
      type: String,
      default: "Product banner",
      unique: true,
    },
    cover_image: {
      type: String,
      default: "Product image",
      unique: true,
    },
    Product_categories: [
      {
        type: String,
        enum: ["PC", "MOBILE", "PLAYSTATION", "XBOX", "ENTERTAINMENT"],
        required: true,
      },
    ],
    Product_type: { type: String, enum: ["Free", "Premuim"], required: true },
    product_genre: {
      type: String,
      enum: ["Game", "Entertainment"],
      required: true,
    },
  },
  { timestamps: true }
);

function arrayLimit(limit) {
  return limit.length <= 5;
}

module.exports = mongoose.model("Products", productSchema);

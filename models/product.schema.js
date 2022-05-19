const mongoose = require("mongoose");


const Products = mongoose.Schema(
  {
    title: {
      type: String,
      unique:true
    },
    description: {
      type: String,
    },
    company: {
      type: String,
    },
    logo: {
      type: String,
    },
    coverImage: {
      type: String,
    },
    banner: {
      type: String,
    },
    categoryId: {type:mongoose.Schema.Types.ObjectId,ref:'Games' },
    platformId: {type:mongoose.Schema.Types.ObjectId,ref:'Platform' }
  },
  { timestamps: true }
);

Products.index({ title: 1});

module.exports = mongoose.model("Products", Products);



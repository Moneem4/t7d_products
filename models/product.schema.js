const mongoose = require("mongoose");


const Products = new Schema(
  {
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

module.exports = mongoose.model("Products", Products);

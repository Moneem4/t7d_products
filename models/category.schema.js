const mongoose = require("mongoose");


const Categorys = mongoose.Schema(
  {
    name: {
      type: String,
      unique:true
    },
    description: {
      type: String,
    },
  },
  { timestamps: true }
);

Categorys.index({ name: 1});


module.exports = mongoose.model("Categorys", Categorys);

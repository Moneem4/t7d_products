const mongoose = require("mongoose");


const Platforms = mongoose.Schema(
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

Platforms.index({ name: 1});


module.exports = mongoose.model("Platforms", Platforms);

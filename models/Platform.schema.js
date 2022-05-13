const mongoose = require("mongoose");


const Platforms = new Schema(
  {
    name: {
      type: String,
    },
    description: {
      type: String,
    },
  },
  { timestamps: true }
);



module.exports = mongoose.model("Platforms", Platforms);

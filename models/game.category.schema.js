const mongoose = require('mongoose');

const Schema = mongoose.Schema;

const gameCategorySchema = new Schema(
  {
    title: {
      type: String,
      default: 'game name',
    },
    developer: {
      type: String,
      default: 'game studio',
    },
    description: {
      type: String,
      default: 'game description',
    },
    logo: {
      type: String,
      default: 'game logo path',
    },
    display: {
      type: Number,
      default: 0,
    },
    banner: {
      type: String,
      default: 'game banner',
      unique: true,
    },
    cover_image: {
      type: String,
      default: 'game image',
      unique: true,
    },
  },
  { timestamps: true }
);

function arrayLimit(limit) {
  return limit.length <= 5;
}

module.exports = mongoose.model('GameCategory', gameCategorySchema);

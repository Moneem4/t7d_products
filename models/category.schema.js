const mongoose = require('mongoose');

const Schema = mongoose.Schema;

const categorySchema = new Schema(
  {
    name: {
      type: String,
      default: 'category name',
    },
    description: {
      type: String,
      default: 'category description',
    },
    icon: { type: String, default: 'category icon' },
    category_cover_image: { type: String, default: 'category cover image' },
  },
  { timestamps: true }
);

function arrayLimit(limit) {
  return limit.length <= 5;
}

module.exports = mongoose.model('Category', categorySchema);

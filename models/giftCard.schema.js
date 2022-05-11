const mongoose = require("mongoose");

const Schema = mongoose.Schema;

const GiftCardSchema = new Schema(
  {
    product_id: {
      ref: "Products",
      type: mongoose.Schema.Types.ObjectId,
      required: true,
    },
    sku: { type: String, required: true },
    provider: { type: String, required: true },
    regions: [
      {
        name: {
          type: String,
          default: "N/A",
        },
        icon: {
          type: String,
          default: "N/A",
        },
      },
    ],
    GiftCard_icon: { type: String, default: "GiftCard icon" },
    name: { type: String, default: "N/A" },
    slug: { type: String, default: "N/A" },
    price: { type: Number, default: 0 },
    original_price: { type: Number, default: 0 },
    discounted: { type: Boolean, default: false },
    featured: { type: Boolean, default: false },
    saleCount: { type: Number, default: 0 },
    rating: { type: Number, default: 0 },
    isNew: { type: Boolean, default: true },
    isHot_deal: { type: Boolean, required: true },
    giftCard_categories: [
      {
        type: String,
        enum: ["PC", "MOBILE", "PLAYSTATION", "XBOX", "ENTERTAINMENT"],
        required: true,
      },
    ],
    giftCard_type: { type: String, enum: ["Free", "Premuim"], required: true },
    tag: [{ type: String, default: "" }],
    discount_percentage: { type: Number, default: 0 },
    full_description: { type: String, required: true },
    short_description: { type: String, required: true },
    activation_steps: [{ type: String, required: true }],
    platforms: [
      {
        name: {
          type: String,
          default: "name",
        },
        icon: {
          type: String,
          default: "platform icon",
        },
      },
    ],
    available: { type: Boolean, required: true },
    quantity: { type: Number, required: true },
    number_of_purchases: { type: Number, default: 0 },
  },
  { timestamps: true }
);

function arrayLimit(limit) {
  return limit.length <= 5;
}

module.exports = mongoose.model("GiftCard", GiftCardSchema);

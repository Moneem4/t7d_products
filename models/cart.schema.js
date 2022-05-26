const mongoose = require('mongoose')

const Carts = mongoose.Schema(
  {
    profileId: {
        type: String,
        unique: true
    },
        giftCardsId: [{
            gifCardId: { type: mongoose.Schema.Types.ObjectId, ref: 'GiftCard' },
            timeOfCreation: {type: Date}
    }],
    lastUpdate: { type: Date},
  },
  { timestamps: true }
)
Carts.index({ profileId: 1 })


module.exports = mongoose.model('Carts', Carts)

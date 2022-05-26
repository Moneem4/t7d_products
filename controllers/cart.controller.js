const CartModel = require('../models/cart.schema');
const GiftCardModel = require('../models/giftCard.schema');
const {display_costume_error} = require('../global_functions/display_costume_error');
const {display_error_message} = require('../global_functions/display_error_message');
const validator = require('../middleware/validatorRequiredData');
const mongoose = require('mongoose');
exports.addToCart = async (req, res) => {
    try {
    const { giftCardId } = req.body;
    if (validator(req.body, ['giftCardId'], res)) {
    return;
        }
        const giftCardData = await GiftCardModel.findOne({ _id: mongoose.Types.ObjectId(giftCardId) }).exec()
        if (giftCardData === null) {
            display_costume_error(res, 'giftcard  _id not found', 404);
            return
        }
        
        CartModel.findOne({ profileId: req.verified.profileId }).exec().then(data => {

            if (data !== null) {
                const calcNumberOfProductBought = () => {
                    return data.giftCardsId.reduce((total, currData) => {
                        if (currData.gifCardId.toString() === giftCardData._id.toString()) {
                            return total + 1
                        } else {
                            return total
                        } 
                    },0);
                }
            if (giftCardData.maxPurchase <= calcNumberOfProductBought()) {
                display_costume_error(res, 'your reached the limit in this item', 404);
                return
            } else {
                data.lastUpdate = new Date()
                data.giftCardsId = [...data.giftCardsId,{gifCardId: giftCardId,timeOfCreation: new Date()}]
                data.save().then(data => {
                    res.status(res.statusCode).json({
                        message: 'gift card was added in cart',
                    });
                }).catch(error => {
                        display_error_message(res, error);
                })
                return
            }
            } else {
            const cart = new CartModel({
                profileId: req.verified.profileId ,
                giftCardsId: [{ gifCardId: giftCardData._id, timeOfCreation: new Date() }],
                lastUpdate: new Date()
            }); 
            cart.save().then(data => {
                res.status(res.statusCode).json({
                    message: 'gift card was saved in cart',
                });
            })
        }
        
        }).catch(error => {
        display_error_message(res, error);
        })
        } catch (error) {
        display_error_message(res, error);
        }
} 
exports.getFromCart = (req, res) => {
    /*const currentDatePlusMonth = new Date((Date.now() + (1000 * 60 * 60 * 24 * -29)))
    CartModel.findOneAndUpdate({ profileId: req.verified.profileId },{$pull: {giftCardsId: {timeOfCreation: {$lt: currentDatePlusMonth }}}},{new: true}).exec().then(data => { 
                res.status(res.statusCode).json({
                    message: 'cart data',
                    data
                });
    }).catch(error => {
         display_error_message(res, error);
    })*/

    const currentDatePlusMonth = new Date((Date.now() + (1000 * 60 * 60 * 24 * -7)))
    CartModel.findOne({ profileId: req.verified.profileId }).populate('giftCardsId.gifCardId','productId description fullDescription price icon').exec().then(data => {
                    if (data.lastUpdate < currentDatePlusMonth) {
                        data.giftCardsId = []
                        data.lastUpdate = new Date()
                        data.save().then(data => {
                                res.status(res.statusCode).json({
                                message: 'new cart data',
                                data
                            });
                        })
                    } else {
                        res.status(res.statusCode).json({
                        message: 'cart data',
                        data
                    });
                    }

    }).catch(error => {
         display_error_message(res, error);
    })

}
exports.deleteFromCart = (req, res) => {
    if (validator(req.body, ['cartItemId'], res)) {
    return;
    }
    CartModel.findOneAndUpdate({ profileId: req.verified.profileId }, { $pull: { giftCardsId: { _id: mongoose.Types.ObjectId(req.body.cartItemId) } } },{new: true}).exec().then(data => {
        res.status(res.statusCode).json({
        message: 'giftcard was removed from  cart',
        data
        });
    }).catch(error => {
         display_error_message(res, error);
    })
}
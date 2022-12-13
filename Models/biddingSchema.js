const mongoose = require('mongoose');

const biddingSchema = new mongoose.Schema(
	{
        bidderId: { type: mongoose.Schema.Types.ObjectId, ref: 'users'},

		bidderName: { type: String, ref: 'users'},

        sellerId: { type: mongoose.Schema.Types.ObjectId, ref: 'users'},

		sellerName: { type: String, ref: 'users'},

        propertyId: { type: mongoose.Schema.Types.ObjectId, ref: 'properties'},

		bidAmount: {
			type: Number,
		},
		actualAmount: {
			type: Number,
		},
		winner: {
			type: Boolean,
			default: false
		},
		
		
	},
	{
		timestamps: true,
	},
);

export default mongoose.model('Bidding', biddingSchema);

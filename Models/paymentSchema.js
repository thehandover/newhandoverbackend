const mongoose = require('mongoose');

const paymentSchema = new mongoose.Schema(
	{
        buyerId: { type: mongoose.Schema.Types.ObjectId, ref: 'users'},
		
		buyerName: { type: String, ref: 'users'},

        sellerId: { type: mongoose.Schema.Types.ObjectId, ref: 'users'},

		sellerName: { type: String, ref: 'users'},

        propertyId: { type: mongoose.Schema.Types.ObjectId, ref: 'properties'},

		propertyName: { type: String, ref: 'properties'},

		biddingId: { type: mongoose.Schema.Types.ObjectId, ref: 'biddings'},

		amount: {
			type: Number,
		},

		paymentStatus: {
			type: String,
			default: "On Hold"
		},
		
	},
	{
		timestamps: true,
	},
);

export default mongoose.model('Payment', paymentSchema);

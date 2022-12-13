const mongoose = require('mongoose');

const propertySchema = new mongoose.Schema(
	{
        userId: { type: mongoose.Schema.Types.ObjectId, ref: 'users'},

		propertyTitle: {
			type: String,
			required: true,
		},
		description: {
			type: String,
		},
		area: {
			type: String,
		},
		propertyType: {
			type: String,
            required: true,
			enum: ['Secondary Unit', 'OffPlan'],
		},
		estCompletion: {
			type: String,
		},
		paymentPlan: {
			type: String,
		},
		
		address: {type: String},
        zip: {type: Number},
        city: {type: String},
        state: {type: String},
		country: {type: String},
		
		bedrooms: {
			type: Number,
		},
		bathrooms: {
			type: Number,
		},
        floors: {
			type: Number,
		},
        priceDemand: {
			type: String,
		},
		topBid: {
			type: Number,
			default: null
		},
        biddingStart: {
			type: Date,
		},
        biddingEnd: {
			type: Date,
		},
		status: {
			type: String,
			default: "On Auction"
		},
		amenities:[],
		images:[],
	},
	{
		timestamps: true,
	},
);

export default mongoose.model('Property', propertySchema);

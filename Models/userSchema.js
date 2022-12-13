const mongoose = require('mongoose');

const userSchema = new mongoose.Schema(
	{
		name: {
			type: String,
			required: true,
		},
		phone: {
			type: Number,
		},
		password: {
			type: String,
		},
		email: {
			type: String,
		},
		userType: {
			type: String,
		},
		code: {
			type: String,
		},
		userStatus: {
			type: String,
			default: 'Active',
		},
		status: {
			type: String,
			default: 'Not Verified',
		},
		imageUrl: {
			type: String,
			default: '',
		},
		stripeId: {
			type: String,
			default:""
		},
		externalAccountConnected: {
			type: Boolean,
			default:false
		},
	},
	{
		timestamps: true,
	},
);

export default mongoose.model('User', userSchema);

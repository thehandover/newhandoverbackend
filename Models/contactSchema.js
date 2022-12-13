const mongoose = require('mongoose');

const contactSchema = new mongoose.Schema(
	{
        email: { type: String, ref: 'users'},

        name: { type: String, ref: 'users'},

		message: {
			type: String,
		},
		
		
	},
	{
		timestamps: true,
	},
);

export default mongoose.model('Contact', contactSchema);

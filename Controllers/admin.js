import bcryptjs from 'bcryptjs';
import status from 'http-status';
import Model from '../Models/Model';
import awsHandler from './aws';
const sgMail = require('@sendgrid/mail');
const mongoose = require('mongoose');

import Stripe from 'stripe';

const stripee = Stripe(process.env.STRIPE_TEST_SECRET);
// user module
const getUsers = (req, res) => {
	Model.UserModel.find()
		.then(events => {
			res.status(status.OK).send(events);
		})
		.catch(err => {
			res.status(status.INTERNAL_SERVER_ERROR).send({
				Message: 'No Events!',
				err,
			});
		});
};

const editUserStatus = (req, res) => {

	const query = { $set: {userStatus:req.body.userstatus} };
	Model.UserModel.findByIdAndUpdate(req.body.id, query, { new: true }, (err, result) => {
		if (err) {
			res.status(status.INTERNAL_SERVER_ERROR).send({
				Message: 'Unable to Update.',
			});
		} else {
			res.status(status.OK).send({
				Message: 'Successfully Updated.',
				result,
			});
		}
	});
};

// property module
const getProperties = (req, res) => {
	Model.PropertyModel.find()
		.then(events => {
			res.status(status.OK).send(events);
		})
		.catch(err => {
			res.status(status.INTERNAL_SERVER_ERROR).send({
				Message: 'No Events!',
				err,
			});
		});
};


const deleteProperty = (req, res) => {
	const { id } = req.params;
	Model.PropertyModel.findByIdAndRemove(id, (err, result) => {
		if (result) {
			res.status(status.OK).send({
				Message: 'Property Deleted Successfully.',
			});
		} else {
			res.status(status.INTERNAL_SERVER_ERROR).send({
				Message: 'Unable to Delete.',
				err,
			});
		}
	});
};


const editProperty = (req, res) => {
	const { id } = req.params;
	const query = { $set: req.body };
	Model.PropertyModel.findByIdAndUpdate(id, query, { new: true }, (err, result) => {
		if (err) {
			res.status(status.INTERNAL_SERVER_ERROR).send({
				Message: 'Unable to Update.',
			});
		} else {
			res.status(status.OK).send({
				Message: 'Successfully Updated.',
				result,
			});
		}
	});
};

const getSingleProperty = (req, res) => {
	const { eid } = req.params;

	Model.PropertyModel.findOne({ _id: eid })
		.then(event => {
			if (!event) {
				return res.status(status.NOT_FOUND).send({
					Message: 'Boat not found',
				});
			}
			return res.status(status.OK).send(event);
		})
		.catch(err => {
			return res.status(status.INTERNAL_SERVER_ERROR).send({
				Message: 'Internal Server Error',
				err,
			});
		});
};

//contact module
const getMessages = (req, res) => {
	Model.ContactModel.find()
		.then(events => {
			res.status(status.OK).send(events);
		})
		.catch(err => {
			res.status(status.INTERNAL_SERVER_ERROR).send({
				Message: 'No Events!',
				err,
			});
		});
};

const getSingleMessage = (req, res) => {
	const { mid } = req.params;

	Model.ContactModel.findOne({ _id: mid })
		.then(event => {
			if (!event) {
				return res.status(status.NOT_FOUND).send({
					Message: 'Boat not found',
				});
			}
			return res.status(status.OK).send(event);
		})
		.catch(err => {
			return res.status(status.INTERNAL_SERVER_ERROR).send({
				Message: 'Internal Server Error',
				err,
			});
		});
};

//bidding module


const getBiddings = (req, res) => {
	// Model.BiddingModel.find()
	// 	.then(events => {
	// 		res.status(status.OK).send(events);
	// 	})
	// 	.catch(err => {
	// 		res.status(status.INTERNAL_SERVER_ERROR).send({
	// 			Message: 'No Events!',
	// 			err,
	// 		});
	// 	});

    Model.BiddingModel.aggregate([
        { 
            "$lookup": { 
                "from": 'properties', 
                "localField": 'propertyId', 
                "foreignField": '_id', 
                "as": 'Property' 
            } 
        },
     
    ]).then(events => {
            res.status(status.OK).send(events);
        })
        .catch(err => {
            res.status(status.INTERNAL_SERVER_ERROR).send({
                Message: 'No Events!',
                err,
            });
        });
};

const getAllBiddingsOnProperty = (req, res) => {
	// Model.BiddingModel.find({propertyId: req.body.propertyId})
	// 	.then(events => {
	// 		res.status(status.OK).send(events);
	// 	})
	// 	.catch(err => {
	// 		res.status(status.INTERNAL_SERVER_ERROR).send({
	// 			Message: 'No Events!',
	// 			err,
	// 		});
	// 	});

    let id = mongoose.Types.ObjectId(req.body.propertyId);
        Model.BiddingModel.aggregate([
            { "$match": { "propertyId": id }},
    
            { 
                "$lookup": { 
                    "from": 'properties', 
                    "localField": 'propertyId', 
                    "foreignField": '_id', 
                    "as": 'Property' 
                } 
            },
         
        ]).then(events => {
                console.log("eventttt" , events)
                res.status(status.OK).send(events);
            })
            .catch(err => {
                res.status(status.INTERNAL_SERVER_ERROR).send({
                    Message: 'No Events!',
                    err,
                });
            });
};


const getHighestBidOnProperty = (req, res) => {
	Model.BiddingModel.find({propertyId: req.body.propertyId}).sort({"bidAmount": -1}).limit(1)
		.then(events => {
			res.status(status.OK).send(events);
		})
		.catch(err => {
			res.status(status.INTERNAL_SERVER_ERROR).send({
				Message: 'No Events!',
				err,
			});
		});


};

const getAllPayments = (req, res) => {
	Model.PaymentModel.find()
		.then(events => {
			res.status(status.OK).send(events);
		})
		.catch(err => {
			res.status(status.INTERNAL_SERVER_ERROR).send({
				Message: 'No Events!',
				err,
			});
		});
};


async function transfer  (req, res)  {

	// const account = await stripee.accounts.update(
	// 	'acct_1H8M3IJEYFz5N2An',
	// 	{tos_acceptance: {date: 1609798905, ip: '59.103.26.110'}}
	//   ).then(events => {
		
	// 	console.log("evv", events)
	// })
	// .catch(err => {
	// 	console.log("err", err)
	// });

	Model.PaymentModel.findOne({_id:req.body.paymentId})
		.then(events => {
			//res.status(status.OK).send(events);
			console.log("events" , events , events.length)

			//if (events.length>0){
			Model.UserModel.findOne({_id:events.sellerId})
			.then(async events2 => {
				//res.status(status.OK).send(events);
				console.log("events2" , events2)

				
				if (events2.externalAccountConnected == true){
					console.log("here testing")

					try {
					const transfer = await stripee.transfers.create({
						amount: req.body.releaseAmount,
						currency: 'usd',
						destination: events2.stripeId,
						transfer_group: 'Handover',
					  }).then((invoiceItem) => {
						  console.log("innn" , invoiceItem)
						  res.status(status.OK).send({
							  savedEvent,
							  Message: 'Payment Transfered Successfully',
							  type: status.Ok,
						  });
					  })
					  .catch((err) => {
						// Deal with an error
						console.log("err" , err)
						res.status(status.INTERNAL_SERVER_ERROR).send({
						  Message: 'Error',
						  err,
					  });
					  });
					}
					catch(err){console.log("err" , err)}
				}
				else{
					res.status(status.INTERNAL_SERVER_ERROR).send({
						Message: 'Bank Account not connected!',
						err,
					});
				}
			})
			.catch(err => {
				res.status(status.INTERNAL_SERVER_ERROR).send({
					Message: 'No Seller exist!',
					err,
				});
			});
		// }
		// else {
		// 	res.status(status.INTERNAL_SERVER_ERROR).send({
		// 		Message: 'No Seller Exist!',
		// 		err,
		// 	});
		// }

		})
		.catch(err => {
			res.status(status.INTERNAL_SERVER_ERROR).send({
				Message: 'No Events!',
				err,
			});
		});

    
}
export default {getUsers, editUserStatus, getProperties, deleteProperty, editProperty, getSingleProperty , getMessages , getSingleMessage , getBiddings , getHighestBidOnProperty , getAllBiddingsOnProperty , getAllPayments , transfer}
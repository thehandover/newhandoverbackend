import status from 'http-status';
import EventSchema from '../Models/eventSchema';
import Model from '../Models/Model';
import awsHandler from './aws';
const sgMail = require('@sendgrid/mail');
const mongoose = require('mongoose');


const getBiddings = (req, res) => {
	Model.BiddingModel.find()
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

const bid = (req, res) => {
	const { propertyId, sellerId, sellerName, bidAmount, actualAmount } = req.body;

                const event = new Model.BiddingModel({
                    bidderId: req.user._id,
                    bidderName: req.user.name,
                    sellerId,
                    sellerName,
                    propertyId,
                    bidAmount,
                    actualAmount
                });
                event
                    .save()
                    .then(savedEvent => {
                        const query = { $set: {topBid:bidAmount}};
                        Model.PropertyModel.findByIdAndUpdate(propertyId, query, { new: true }, (err, result) => {
                            if (err) {
                                res.status(status.INTERNAL_SERVER_ERROR).send({
                                    Message: 'Unable to Update top bid.',
                                });
                            } });

                            res.status(status.OK).send({
                            savedEvent,
                            Message: 'Bid Created Successfully',
                            type: status.Ok,
                        });
                    })
                    .catch(err => {
                        res.status(status.INTERNAL_SERVER_ERROR).send({
                            Message: status.INTERNAL_SERVER_ERROR,
                            err,
                        });
                    });
};

const getUserBiddings = (req, res) => {
	
        let id = mongoose.Types.ObjectId(req.user._id);
try{
    console.log("samamam" ,req.user._id )
    Model.BiddingModel.aggregate([
        //$match: { "_id": mongoose.Types.ObjectId("606c1ceb362b366a841171dc") }
        { "$match": { "bidderId": id }},

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
    }
    catch(err){
        res.send(err)
    }
};

const getAllBiddingsOnProperty = (req, res) => {
	Model.PropertyModel.findOne({ _id: req.body.propertyId })
		.then(event => {
			// if (!event) {
			// 	return res.status(status.NOT_FOUND).send({
			// 		Message: 'Property not found',
			// 	});
			// }
			//return res.status(status.OK).send(event);
		
		

    let id = mongoose.Types.ObjectId(req.body.propertyId);

    Model.BiddingModel.aggregate([
        //$match: { "_id": mongoose.Types.ObjectId("606c1ceb362b366a841171dc") }
        { "$match": { "propertyId": id }},

        { 
            "$lookup": { 
                "from": 'users', 
                "localField": 'bidderId', 
                "foreignField": '_id', 
                "as": 'Bidder' 
            } 
        },
     
    ]).then(events => {
            console.log("eventttt" , events)
            res.status(status.OK).send({events , property:event});
        })
        .catch(err => {
            res.status(status.INTERNAL_SERVER_ERROR).send({
                Message: 'No Events!',
                err,
            });
        });

    })
};

const getSellerPropertyiesBiddings = (req, res) => {
	Model.BiddingModel.find({sellerId: req.user._id})
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

const editStatus = (req, res) => {

        Model.BiddingModel.findOneAndUpdate(req.body.bidId,{$set:{winner:true}})   
        .then((docs)=>{
            if(docs) {
                res.send("updated")
            } else {
                res.send("no data found")
            }
        }).catch((err)=>{
            res.status(500);
            next(new Error("INTERNAL_SERVER_ERROR"));
        })
   
};

// const getAllBiddingsOnProperty = (req, res) => {
// 	Model.BiddingModel.find({propertyId: req.body.propertyId})
// 		.then(events => {
// 			res.status(status.OK).send(events);
// 		})
// 		.catch(err => {
// 			res.status(status.INTERNAL_SERVER_ERROR).send({
// 				Message: 'No Events!',
// 				err,
// 			});
// 		});
// };

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

const acceptBid = (req, res) => {
	const { bidid } = req.params;
	const query = { $set: {winner:true }};
	Model.BiddingModel.findByIdAndUpdate(bidid, query, { new: true }, (err, result) => {
		if (err) {
			res.status(status.INTERNAL_SERVER_ERROR).send({
				Message: 'Unable to Update.',
			});
		} else {
			// res.status(status.OK).send({
			// 	Message: 'Successfully Updated.',
			// 	result,
			// });
console.log("result" , result)
            const query = { $set: {status:"Sold"}};
                        Model.PropertyModel.findByIdAndUpdate(result.propertyId, query, { new: true }, (err, result) => {
                            if (err) {
                                res.status(status.INTERNAL_SERVER_ERROR).send({
                                    Message: 'Unable to Update top bid.',
                                });
                            } });

                            res.status(status.OK).send({
                                result,
                            Message: 'Bid accepted Successfully',
                            type: status.Ok,
                        });
		}
	});
};

const bidderCounts = (req, res) => {
	console.log("usre" , req.user)

    const postCount = Model.BiddingModel.aggregate([{$group: {
        //_id : null,
        bidderId,
        count : { $sum : 1}
      }}, {$project: {
        _id : 0
      }}]).then(events => {
         		console.log("res" , events)
      })


//     Model.BiddingModel.aggregate([{$group:{_id:"$bidderId" , count:{$sum:1}}}]).then(events => {
//         console.log("res" , events)
// })




	// Model.BiddingModel.find({userId:req.user._id}).count()
	// 	.then(events => {
	// 		console.log("res" , events).then(events => {
	// 		console.log("res" , events)
	// 		//res.status(status.OK).send(events);

	// 		Model.BiddingModel.find({sellerId:req.user._id}).count()
	// 		.then(events2 => {
	// 			console.log("res" , events2)
	// 			res.status(status.OK).send({properties:events , biddings:events2});
	// 		})
	// 		.catch(err => {
	// 			res.status(status.INTERNAL_SERVER_ERROR).send({
	// 				Message: 'No Events!',
	// 				err,
	// 			});
	// 		});
	// 	})
};

export default { getBiddings, bid , getUserBiddings , getSellerPropertyiesBiddings , getAllBiddingsOnProperty , editStatus , getHighestBidOnProperty , acceptBid , bidderCounts};
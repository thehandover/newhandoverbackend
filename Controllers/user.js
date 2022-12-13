import bcryptjs from 'bcryptjs';
import status from 'http-status';
import Model from '../Models/Model';
import awsHandler from './aws';
const sgMail = require('@sendgrid/mail');
var cron = require('node-cron');


import Stripe from 'stripe';

const stripee = Stripe(process.env.STRIPE_TEST_SECRET);

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

const editUser = (req, res) => {
	const { id } = req.params;
    const { imageUrl } = req.body;
    	if (imageUrl !== '' && req.file !== undefined) {
		awsHandler
			.UploadToAws(req.file)
			.then((image) => {
	
                req.body.imageUrl = image;
                const query = { $set: req.body };
                Model.UserModel.findByIdAndUpdate(id, query, { new: true }, (err, result) => {
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
            
            })
            
            .catch((err) => {
				res.status(500);
				next(new Error(err));
			});
	} else {
		// res.status(500);
		// next(new Error('Image is required'));

        const query = { $set: req.body };
                Model.UserModel.findByIdAndUpdate(id, query, { new: true }, (err, result) => {
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
	}
};

const getSingleUser = (req, res) => {

	Model.UserModel.findOne({ _id: req.user._id })
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

const resetPassword = (req, res , next) => {
    const {  currpassword , newpassword } = req.body;

Model.UserModel.findOne({ _id: req.user._id })
    .then(event => {
        if (!event) {
            // return res.status(status.NOT_FOUND).send({
            // 	Message: 'User not found',
            // });
            res.status(400);
        next(new Error('User not found'));
        }
        else{

        //return res.status(status.OK).send(event.password);
        bcryptjs.compare(currpassword, event.password).then(result => {
            
            if (result) {
                console.log("matched");
                
                bcryptjs.hash(newpassword, 12).then((hashedpassword) => {
                    
                    Model.UserModel.findOneAndUpdate({_id: req.user._id},{$set:{password:hashedpassword}})   
                    .then((docs)=>{
                        if(docs) {
                            res.send("updated")
                            } else {
                                res.send("no data found")
                                }
                                }).catch((err)=>{
                                    res.status(400);
                next(new Error(err));
                                    })
                                    })

            } else {
                res.status(400);
                next(new Error('Invalid Password'));
            }

        });


        }
    })
    .catch(err => {
        // return res.status(status.INTERNAL_SERVER_ERROR).send({
        // 	Message: 'Internal Server Error',
        // 	err,
        // });
        res.status(500);
        next(new Error("INTERNAL_SERVER_ERROR"));
    });

};

const forgotPass = (req, res) => {
const { email} = req.body;

const genRanHex = size => [...Array(size)].map(() => Math.floor(Math.random() * 16).toString(16)).join('');
		let code = genRanHex(32);
		console.log("code" , code);
        const link = `https://thehandover.com/forgotpassword/?code=${code}`;

    Model.UserModel.findOne({ email }).then(user => {
        if (user) {
            Model.UserModel.findOneAndUpdate({email: req.body.email},{$set:{code:code}})   
			.then((docs)=>{
                sgMail.setApiKey(process.env.SENDGRID_API_KEY);
                
                const msg = {
                    to: req.body.email,
                    from: 'no-reply@thehandover.com',
                    subject: "Reset Password Request ....!!!",
                    html: `Click on below link to reset your password <br> ${link}`,
                };
                sgMail.send(msg)
                .then(() => {
                    console.log('Email sent')
                    res.send('Email sent')
                })
                .catch((error) => {console.error(error)
                }) 

            }).catch((err)=>{
                res.send(error)
            })
              
        } else {
            res.status(400);
            next(new Error('No User Exist With This Email'));
        }
    });    

};

const editPass = (req, res) => {

    const { code , password} = req.body;

    bcryptjs.hash(password, 12).then((hashedpassword) => {
        Model.UserModel.findOneAndUpdate({code: code},{$set:{password:hashedpassword}})   
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
    })
};


async function addBank  (req, res)  {

    // const token = await stripee.tokens.create({
    //     card: {
    //       number: '4242424242424242',
    //       exp_month: 12,
    //       exp_year: 2022,
    //       cvc: '314',
    //     },
    //   });

    const token = await stripee.tokens.create({
        card: {
          number: req.body.cardNumber,
          exp_month:  req.body.expMonth,
          exp_year:  req.body.expYear,
          cvc:  req.body.cvc,
          currency: "usd"
        },
      });
      //console.log("token" , token)

    const bankAccount = await stripee.accounts.createExternalAccount(
        req.user.stripeId,
        {
          external_account: token.id,
        }
      ).then(account => {
        //console.log("charde" , account)
        
        Model.UserModel.findByIdAndUpdate(req.user._id,{$set:{externalAccountConnected:true}})   
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
    })
    .catch(err => {
        console.log("err" , err)
    });

};

//00 00 00 * * *
// cron.schedule('* * * * * ', () => {
//     console.log('running a task at 12 am ');
//     console.log("new date" , new Date())

//     Model.PropertyModel.aggregate([
//         {$match: {biddingEnd: {$lte: new Date()}}},
//         {$lookup: {from: 'biddings', localField: '_id', foreignField: 'propertyId', as: 'bid'}},
//         {$sort: {"bidAmount": -1}},
//        ]).then(events => {
//         console.log("eventttt" , events, events[0].bid)
//         res.status(status.OK).send(events);
//     })
//     .catch(err => {
//         res.status(status.INTERNAL_SERVER_ERROR).send({
//             Message: 'No Events!',
//             err,
//         });
//     });


    // Model.PropertyModel.find({biddingEnd: {$lte: new Date()}}).sort({priceDemand:1})
    
	// 	.then(events => {
    //         console.log("eventttt" , events)
	// 		res.status(status.OK).send(events);
	// 	})
	// 	.catch(err => {
	// 		res.status(status.INTERNAL_SERVER_ERROR).send({
	// 			Message: 'No Events!',
	// 			err,
	// 		});
	// 	});
    
//});
   

export default {getUsers, getSingleUser, editUser, resetPassword, editPass, forgotPass , addBank};
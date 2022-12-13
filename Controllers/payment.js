import bcryptjs from 'bcryptjs';
import status from 'http-status';
import Model from '../Models/Model';
import awsHandler from './aws';

import Stripe from 'stripe';

import paymentHandler from './stripe';
import { CostExplorer } from 'aws-sdk';
const stripee = Stripe(process.env.STRIPE_TEST_SECRET);

async function paymentByUser (req, res, next) {
console.log("her")
    const token = await stripee.tokens.create({
        card: {
          number: '4242424242424242',
          exp_month: 12,
          exp_year: 2022,
          cvc: '314',
        },
      });

      console.log("token " , token.id)
    //const { token } = req.body;
    // first we will process payment
    const StripeOptions = {
        amount: 10 * 100,
        currency: 'USD',
        description: 'Subscription fee',
        //payment_method: token.id,
        //payment_method_data: [token.id],
        payment_method_types: ['card'],
        confirm: true,
    };

    const charge =  stripee.charges.create({
        //amount:  Math.round(amount.toFixed(2) * 100) ,
        amount:100,
        currency: 'usd',
        description: `testing`,
        source: token.id,
        
    }).then(charge => {
        console.log("charde" , charge)
    })
    .catch(err => {
        console.log("err" , err)
    });
    
};

async function pay (req, res, next) {

    const {amount, tokenn , sellerId , sellerName, propertyId , propertyName, biddingId} = req.body

    const token = await stripee.tokens.create({
        card: {
          number: '4242424242424242',
          exp_month: 12,
          exp_year: 2022,
          cvc: '314',
        },
      });

      console.log("token " , token.id)

        const charge =  stripee.charges.create({
            //amount:  Math.round(amount.toFixed(2) * 100) ,
            amount: amount * 100,
            currency: 'usd',
            description: `Payment for handover`,
            //source: token.id,
            source: tokenn,

        }).then(charge => {
            console.log("charge" , charge)
            const event = new Model.PaymentModel({
                buyerId:req.user._id,
                buyerName: req.user.name,
                sellerId,
                sellerName,
                propertyId,
                propertyName,
                biddingId,
                amount
            });
            event
                .save()
                .then(savedEvent => {
                    res.status(status.OK).send({
                        savedEvent,
                        Message: 'Payment Created Successfully',
                        type: status.Ok,
                    });
                })
                .catch(err => {
                    res.status(status.INTERNAL_SERVER_ERROR).send({
                        Message: status.INTERNAL_SERVER_ERROR,
                        err,
                    });
                });
        
        })
        .catch(err2 => {
            console.log("err" , err2)
            res.status(status.INTERNAL_SERVER_ERROR).send({
              Message: status.INTERNAL_SERVER_ERROR,
              err2,
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

const getSellerPayments = (req, res) => {
	Model.PaymentModel.find({sellerId: req.user._id})
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

const getBuyerPayments = (req, res) => {
	Model.PaymentModel.find({buyerId: req.user._id})
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


async function payTest (req, res, next) {
console.log("here")
    stripee.customers
  .create({
    email: req.user.email,
  })
  .then((customer) => {
      console.log("cust" , customer)
    // have access to the customer object
    return stripee.invoiceItems
      .create({
        customer: customer.id, // set the customer id
        amount: 2500, // 25
        currency: 'usd',
        description: 'One-time setup fee',
      })
      .then((invoiceItem) => {
          console.log("innn" , invoiceItem)
        return stripee.invoices.create({
          collection_method: 'send_invoice',
          customer: invoiceItem.customer,
        });
      })
      .then((invoice) => {
          console.log("invoice" , invoice , typeof(invoice))
        // New invoice created on a new customer
      })
      .catch((err) => {
        // Deal with an error
      });
  });

    // const {amount, tokenn , sellerId , propertyId , biddingId} = req.body

    // const token = await stripee.tokens.create({
    //     card: {
    //       number: '4242424242424242',
    //       exp_month: 12,
    //       exp_year: 2022,
    //       cvc: '314',
    //     },
    //   });

    //   console.log("token " , token.id)

    //     const charge =  stripee.charges.create({
    //         //amount:  Math.round(amount.toFixed(2) * 100) ,
    //         amount: amount * 100,
    //         currency: 'usd',
    //         description: `Payment for handover`,
    //         //source: token.id,
    //         source: tokenn,

    //     }).then(charge => {
    //         console.log("charge" , charge)
    //         const event = new Model.PaymentModel({
    //             buyerId:req.user._id,
    //             sellerId,
    //             propertyId,
    //             biddingId,
    //             amount
    //         });
    //         event
    //             .save()
    //             .then(savedEvent => {
    //                 res.status(status.OK).send({
    //                     savedEvent,
    //                     Message: 'Payment Created Successfully',
    //                     type: status.Ok,
    //                 });
    //             })
    //             .catch(err => {
    //                 res.status(status.INTERNAL_SERVER_ERROR).send({
    //                     Message: status.INTERNAL_SERVER_ERROR,
    //                     err,
    //                 });
    //             });
        
    //     })
    //     .catch(err => {
    //         console.log("err" , err)
    //     });
        
};

export default { paymentByUser , pay , getAllPayments , getSellerPayments , getBuyerPayments , payTest };
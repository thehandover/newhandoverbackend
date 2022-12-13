import bcryptjs from 'bcryptjs';
import Model from '../Models/Model';
import awsHandler from './aws';
const sgMail = require('@sendgrid/mail');


import Stripe from 'stripe';

import paymentHandler from './stripe';
import { CostExplorer } from 'aws-sdk';
const stripee = Stripe(process.env.STRIPE_TEST_SECRET);

// const userSignUp = (req, res, next) => {
// 	const { name, password, email, imageUrl } = req.body;
// 	if (imageUrl !== '' && req.file !== undefined) {
// 		awsHandler
// 			.UploadToAws(req.file)
// 			.then((image) => {
// 				const query = { email };
// ++
// 				Model.UserModel.findOne(query)
// 					.then((user) => {
// 						if (user) {
// 							if (user.email == email) {
// 								res.status(400);
// 								next(new Error('Email Already Taken.'));
// 							}
// 						} else {
// 							bcryptjs.hash(password, 12).then((hashedpassword) => {
// 								const User = new Model.UserModel({
// 									name,
// 									password: hashedpassword,
// 									email,
// 									imageUrl: image,
// 									userType: 'user',
// 								});
// 								// console.log(User);
// 								User.save()
// 									.then((SavedUser) => {
// 										console.log(SavedUser);
// 										return res.status(200).send({
// 											Message: 'Account Created Successfully.',
// 											SavedUser,
// 										});
// 									})
// 									.catch((err) => {
// 										res.status(500);
// 										next(
// 											new Error(
// 												`Unable to Create User. Please Try later. ${err}`,
// 											),
// 										);
// 									});
// 							});
// 						}
// 					})
// 					.catch((err) => {
// 						res.status(500);
// 						next(new Error(err));
// 					});
// 			})
// 			.catch((err) => {
// 				res.status(500);
// 				next(new Error(err));
// 			});
// 	} else {
// 		res.status(500);
// 		next(new Error('Image is required'));
// 	}
// };


async function userSignUp  (req, res, next) {
	const { name, password, email , userType, phone } = req.body;
		var hostname= "localhost";
		var link = "Election-site.herokuapp.com/login";
		const genRanHex = size => [...Array(size)].map(() => Math.floor(Math.random() * 16).toString(16)).join('');
		let code = genRanHex(32);
		console.log("code" , code);

		const account = await stripee.accounts.create({type: 'express'});
		//console.log("account" , account)

					const query = { email };
	
					Model.UserModel.findOne(query)
						.then((user) => {
							if (user) {
								if (user.email == email) {
									res.status(400);
									next(new Error('Email Already Taken.'));
								}
							} else {
								bcryptjs.hash(password, 12).then((hashedpassword) => {
									const User = new Model.UserModel({ 
										name,
										phone,
										password: hashedpassword,
										email,
										userType,
										code:code,
										stripeId: account.id
									});
									// console.log(User);
									User.save()
										.then((SavedUser) => {

											const hostname= "localhost";	
											const link = `https://thehandover.com/user/verification?code=${code}`;
											console.log(process.env.SENDGRID_API_KEY)
											sgMail.setApiKey(process.env.SENDGRID_API_KEY);
											const msg = {
												to: req.body.email,
												from: 'no-reply@thehandover.com',
												subject: "Email Verification....!!!",
												html: `Click on below link to verify your email <br> ${link}`,
											};
											sgMail.send(msg)
											.then(() => {
												console.log('Email sent')
											})
											.catch((error) => {console.error(error)
											})

											console.log(SavedUser);
											return res.status(200).send({
												Message: 'Account Created Successfully.',
												SavedUser,
											});
										})
										.catch((err) => {
											res.status(500);
											next(
												new Error(
													`Unable to Create User. Please Try later. ${err}`,
												),
											);
										});
								});
							}
						})
						.catch((err) => {
							res.status(500);
							next(new Error(err));
						});
				
		 
	};
	
	const editStatus = (req, res) => {
		console.log(req.body.email)
			Model.UserModel.findOneAndUpdate({code: req.body.code},{$set:{status:"Verified"}})   
			.then((docs)=>{
		if(docs) {
		   res.send("updated")
		} else {
		   res.send("no data found")
		}
	}).catch((err)=>{
	  res.send(error)
	})
	} 
	
export default {userSignUp, editStatus};

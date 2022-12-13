import bcryptjs from 'bcryptjs';
import status from 'http-status';
import Model from '../Models/Model';
import awsHandler from './aws';
const sgMail = require('@sendgrid/mail');

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

const ContactUs = (req, res) => {
	const { email, name, message } = req.body;

	const event = new Model.ContactModel({
		name,
		email,
		message,
	});
	event
		.save()
		.then(savedEvent => {
			res.status(status.OK).send({
				savedEvent,
				Message: 'Message Sent Successfully',
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
export default { getMessages, ContactUs, getSingleMessage };

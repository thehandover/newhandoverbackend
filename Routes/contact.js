import express from 'express';
import contacts from '../Controllers/contact';

// auth middlewares for admin
import isAdminMiddleware from '../Middlewares/isManager';
// auth middleware for user
import isLoggedInUser from '../Middlewares/loggedIn';

const contactRouter = express.Router();

contactRouter.post(
	'/contactus',
	contacts.ContactUs,
);

contactRouter.get('/',  contacts.getMessages);

contactRouter.get('/:mid',  contacts.getSingleMessage);


export default contactRouter;

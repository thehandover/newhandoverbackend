import express from 'express';
import payments from '../Controllers/payment';
import multer from 'multer'
// auth middlewares for admin
import isAdminMiddleware from '../Middlewares/isManager';
// auth middleware for user
import isLoggedInUser from '../Middlewares/loggedIn';
const storage = multer.memoryStorage();
const upload = multer({
	storage,
});

const paymentRouter = express.Router();

paymentRouter.get('/', isLoggedInUser.isLoggedIn, payments.getAllPayments);

paymentRouter.post('/pay', isLoggedInUser.isLoggedIn, payments.pay);

paymentRouter.get('/seller', isLoggedInUser.isLoggedIn, payments.getSellerPayments);

paymentRouter.get('/buyer', isLoggedInUser.isLoggedIn, payments.getBuyerPayments);

paymentRouter.post('/paytest', isLoggedInUser.isLoggedIn, payments.payTest);


export default paymentRouter;

import express from 'express';
import biddings from '../Controllers/bidding';
import multer from 'multer'
// auth middlewares for admin
import isAdminMiddleware from '../Middlewares/isManager';
// auth middleware for user
import isLoggedInUser from '../Middlewares/loggedIn';
const storage = multer.memoryStorage();
const upload = multer({
	storage,
});

const biddingRouter = express.Router();

biddingRouter.post('/bid', isLoggedInUser.isLoggedIn, biddings.bid);

biddingRouter.get('/', isLoggedInUser.isLoggedIn, biddings.getBiddings);

biddingRouter.get('/userbiddings', isLoggedInUser.isLoggedIn, biddings.getUserBiddings);

biddingRouter.get('/sellerproperties', isLoggedInUser.isLoggedIn, biddings.getSellerPropertyiesBiddings);

biddingRouter.get('/property', isLoggedInUser.isLoggedIn, biddings.getAllBiddingsOnProperty);

biddingRouter.post('/editstatus', isLoggedInUser.isLoggedIn, biddings.editStatus);

biddingRouter.post('/highest', isLoggedInUser.isLoggedIn, biddings.getHighestBidOnProperty);

biddingRouter.post('/acceptbid/:bidid', isLoggedInUser.isLoggedIn, biddings.acceptBid);

biddingRouter.post('/bidcount', isLoggedInUser.isLoggedIn, biddings.bidderCounts);

export default biddingRouter;

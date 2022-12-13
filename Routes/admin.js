import express from 'express';
import admin from '../Controllers/admin';

// auth middlewares for admin
import isAdminMiddleware from '../Middlewares/isManager';

const adminRouter = express.Router();

//users
adminRouter.get('/users/all', isAdminMiddleware.isManagerOwner, admin.getUsers);

adminRouter.post('/user/editstatus', isAdminMiddleware.isManagerOwner, admin.editUserStatus);

//properties
adminRouter.get('/properties/all', isAdminMiddleware.isManagerOwner,  admin.getProperties);

adminRouter.get('/property/:eid',  isAdminMiddleware.isManagerOwner, admin.getSingleProperty);

adminRouter.delete('/property/delete/:id', isAdminMiddleware.isManagerOwner, admin.deleteProperty);

adminRouter.patch('/property/edit/:id', isAdminMiddleware.isManagerOwner, admin.editProperty);

//contact

adminRouter.get('/messages/all', isAdminMiddleware.isManagerOwner,  admin.getMessages);

adminRouter.get('/message/:mid', isAdminMiddleware.isManagerOwner,  admin.getSingleMessage);

//bidding

adminRouter.post('/bidding/highest', isAdminMiddleware.isManagerOwner, admin.getHighestBidOnProperty);

adminRouter.get('/bidding/all', isAdminMiddleware.isManagerOwner, admin.getBiddings);

adminRouter.get('/bidding/onproperty', isAdminMiddleware.isManagerOwner, admin.getAllBiddingsOnProperty);

//payment 
adminRouter.get('/payment/all', isAdminMiddleware.isManagerOwner, admin.getAllPayments);
adminRouter.post('/payment/transfer',  isAdminMiddleware.isManagerOwner, admin.transfer);

export default adminRouter;

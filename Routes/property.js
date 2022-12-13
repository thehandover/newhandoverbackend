import express from 'express';
import properties from '../Controllers/property';
import multer from 'multer'
// auth middlewares for admin
import isAdminMiddleware from '../Middlewares/isManager';
// auth middleware for user
import isLoggedInUser from '../Middlewares/loggedIn';
const storage = multer.memoryStorage();
const upload = multer({
	storage,
});

const propertyRouter = express.Router();

propertyRouter.post(
	'/add',
	isLoggedInUser.isLoggedIn,
    upload.array('images'),
	properties.addProperty,
);

propertyRouter.get('/',  properties.getProperties);

propertyRouter.get('/userproperties', isLoggedInUser.isLoggedIn, properties.getUserProperties);

propertyRouter.get('/:eid',  properties.getSingleProperty);

propertyRouter.delete('/delete/:id', isLoggedInUser.isLoggedIn, properties.deleteProperty);

propertyRouter.patch('/edit/:id', isLoggedInUser.isLoggedIn, properties.editProperty);

propertyRouter.get('/filter/pricerange',  properties.priceFilter)

propertyRouter.get('/filter/others',  properties.filterProperties)

propertyRouter.get('/sort/asc',  properties.sortAscending)

propertyRouter.get('/sort/desc',  properties.sortDescending)

propertyRouter.get('/sort/pricedesc',  properties.sortPriceDescending)

propertyRouter.get('/sort/priceasc',  properties.sortPriceAscending)

propertyRouter.post('/search',  properties.searchProperty)

propertyRouter.post('/counts',  properties.counts)

propertyRouter.post('/sellercounts',  properties.sellerCounts)

propertyRouter.post('/sellergraph', isLoggedInUser.isLoggedIn,  properties.sellergraph)

export default propertyRouter;

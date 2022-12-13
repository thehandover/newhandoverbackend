import express from 'express';
import multer from 'multer';
import userSignUp from '../Controllers/userSignup';
import userValidator from '../validations/user';

const storage = multer.memoryStorage();
const upload = multer({
	storage,
});
const signUpRouter = express.Router();

signUpRouter.post(
	'/',
	userValidator.userSignup,
	userSignUp.userSignUp,
);

signUpRouter.post(
	'/verifyemail',
	userSignUp.editStatus,
);
export default signUpRouter;

import {Router} from 'express';
import {signup, login, updateProfile} from '../controllers/userController.js';
import { protectRoute } from '../middleware/auth.js';

const userRouter = Router();

userRouter.post('/signup', signup);
userRouter.post('/login', login);
userRouter.put('/update-profile', protectRoute, updateProfile);


export default userRouter;

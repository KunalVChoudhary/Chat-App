import {Router} from 'express';
import {signup, login, updateProfile, checkAuth} from '../controllers/userController.js';
import { protectRoute } from '../middleware/auth.js';

const userRouter = Router();

userRouter.post('/signup', signup);
userRouter.post('/login', login);
userRouter.put('/update-profile', protectRoute, updateProfile);
userRouter.get('/auth/check', protectRoute, checkAuth);

export default userRouter;

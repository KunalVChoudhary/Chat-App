import {Router} from 'express';
import {protectRoute} from '../middleware/auth.js';
import {getUserForSidebar, getMessagesBetweenUsers, markMessagesAsSeen} from '../controllers/messageController.js';

const messageRouter = Router();

messageRouter.get('/sidebar-users', protectRoute, getUserForSidebar);
messageRouter.get('/user/:userId', protectRoute, getMessagesBetweenUsers);
messageRouter.put('/mark-seen/:messageId', protectRoute, markMessagesAsSeen);   

export default messageRouter;
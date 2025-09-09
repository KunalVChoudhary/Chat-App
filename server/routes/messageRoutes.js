import {Router} from 'express';
import {protectRoute} from '../middleware/auth.js';
import {getUserForSidebar, getMessagesBetweenUsers, markMessagesAsSeen, sendMessage} from '../controllers/messageController.js';

const messageRouter = Router();

messageRouter.get('/sidebar-users', protectRoute, getUserForSidebar);
messageRouter.get('/user/:userId', protectRoute, getMessagesBetweenUsers);
messageRouter.put('/mark-seen/:messageId', protectRoute, markMessagesAsSeen);   
messageRouter.post('/send/:userId', protectRoute, sendMessage);

export default messageRouter;
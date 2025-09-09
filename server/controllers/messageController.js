import Message from "../models/Message";
import User from "../models/User";
import cloudinary from "../lib/cloudinary";
import { io, userSocketMap } from "../server.js";

//Get all users except the loggenin user
export const getUserForSidebar = async (req, res) => {
    try {
        const userID= req.user._id
        const filteredUsers = await User.find({ _id: { $ne: userID } }).select('-password');

        //count unseen messages for each user
        const usersWithUnseenCount = await Promise.all(filteredUsers.map(async (user) => {
            const unseenCount = await Message.countDocuments({ senderId: user._id, receiverId: userID, seen: false });
            return { ...user.toObject(), unseenCount };
        }));
        res.status(200).json({ success: true, users: filteredUsers, usersWithUnseenCount });
    } catch (error) {
        console.error(error.message);
        res.status(500).json({ success: false, message: error.message });
    }
}

//get all messages for between 2 user
export const getMessagesBetweenUsers = async (req, res) => {
    try {
        const userID= req.user._id
        const otherUserId = req.params.userId;

        const messages = await Message.find({
            $or: [
                { senderId: userID, receiverId: otherUserId },
                { senderId: otherUserId, receiverId: userID }
            ]
        }).sort({ createdAt: 1 }); // Sort by creation time in ascending order
        await Message.updateMany({ senderId: otherUserId, receiverId: userID, seen: false }, { $set: { seen: true } });
        res.status(200).json({ success: true, messages });
    } catch (error) {
        console.error(error.message);
        res.status(500).json({ success: false, message: error.message });
    }
}

 //mark message as seen using message._id
 export const markMessagesAsSeen = async (req, res) => {
    try {
        const messageId = req.params.messageId;
        const message = await Message.findByIdAndUpdate(messageId, { seen: true });
        if (!message) {
            return res.status(404).json({ success: false, message: 'Message not found' });
        }
        res.status(200).json({ success: true, message: 'Message marked as seen' });
    } catch (error) {
        console.error(error.message);
        res.status(500).json({ success: false, message: error.message });
    }
}

//send message from one user to another
export const sendMessage = async (req, res) => {
    try {
        const senderId = req.user._id;
        const receiverId = req.params.userId;
        const {text,image} = req.body;
        let imageUrl;
        if(image){
            //image is in base64 format
            //upload image to cloudinary
            const uploadResponse = await cloudinary.uploader.upload(image);
            imageUrl = uploadResponse.secure_url;
        }
        const newMessage = new Message({
            senderId,
            receiverId,
            text,
            image: imageUrl
        });
        await newMessage.save();
        //emit socket event to receiver if online
        const receiverSocketId = userSocketMap.get(receiverId.toString());
        if (receiverSocketId) {
            io.to(receiverSocketId).emit('new-message', newMessage);
        }
        res.status(201).json({ success: true, message: 'Message sent successfully', newMessage });
    } catch (error) {
        console.error(error.message);
        res.status(500).json({ success: false, message: error.message });
    }
}
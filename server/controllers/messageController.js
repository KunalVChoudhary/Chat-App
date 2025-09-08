import Message from "../models/Message";

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

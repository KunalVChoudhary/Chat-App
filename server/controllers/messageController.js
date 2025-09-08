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
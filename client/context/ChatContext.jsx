import { useState, createContext, useContext, useEffect } from "react";
import { AuthContext } from "./authContext";
import { toast } from "react-toastify";

const ChatContext = createContext();

const ChatProvider = ({children}) => {

    const [messages, setMessages] = useState([]);
    const [selectedUser, setSelectedUser] = useState(null);
    const [users, setUsers] = useState([]);
    const [unseenMessages, setUnseenMessages] = useState({});


    const {socket,axios} = useContext(AuthContext);

    const getUsers = async () => {
        try {
            const response = await axios.get('/api/messages/sidebar-users');
            if (response.data.success) {
                setUsers(response.data.users);
                const unseenMap = {};
                response.data.usersWithUnseenCount.forEach(user => {
                    unseenMap[user._id] = user.unseenCount;
                });
                setUnseenMessages(unseenMap);
            } else {
                toast.error(response.data.message);
            }
        } catch (error) {
            console.error('Error fetching users:', error);
            toast.error('Error fetching users');
        }
    }

    const getMessages = async (userId) => {
        try {
            const response = await axios.get(`/api/messages/user/${userId}`);
            if (response.data.success) {
                setMessages(response.data.messages);
            } else {
                toast.error(response.data.message);
            }
        } catch (error) {
            console.error('Error fetching messages:', error);
            toast.error('Error fetching messages');
        }
    }

    const sendMessage = async (messageData) => { 
        try {
            const response = await axios.post(`/api/messages/send/${selectedUser._id}`, messageData); 
            if (response.data.success) {
                setMessages(prevMessages => [...prevMessages, response.data.newMessage]);
                socket.emit('new-message', { message: response.data.message, to: selectedUser._id });
            }  else {
                toast.error(response.data.message);
            }         
        } catch (error) {
            console.error('Error sending message:', error);
            toast.error('Error sending message');
        }
    }

    const markMessageAsSeen = async (messageId) => {
        try {
            const response = await axios.put(`/api/messages/mark-seen/${messageId}`);
            if (!response.data.success) {
                toast.error('Error marking message as seen');
            }
        } catch (error) {
            console.error('Error marking message as seen:', error);
            toast.error('Error marking message as seen');
        }
    }

    async function subscribeSocketMessages() {
        if (!socket) return;
        socket.on('new-message', (data) => {
            if (data.senderId === selectedUser?._id) {
                data.seen = true;
                setMessages(prevMessages => [...prevMessages, data]);
                // Optionally, mark message as seen immediately
                markMessageAsSeen(data._id);
            } else {
                setUnseenMessages(prev => ({
                    ...prev,
                    [data.senderId]: (prev[data.senderId] || 0) + 1
                }));

                toast.info('New message received');
            }
        });
    }

    const unsubscribeSocketMessages = () => {
        if (!socket) return;
        socket.off('new-message');
    }

    useEffect(() => {
        subscribeSocketMessages();
        return () => {
            unsubscribeSocketMessages();
        };
    }, [socket, selectedUser]); 

    const value = {
        messages,
        setMessages,
        selectedUser,
        setSelectedUser,
        users,
        setUsers,
        unseenMessages,
        setUnseenMessages,
        getUsers,
        getMessages,
        sendMessage,
        markMessageAsSeen,
        subscribeSocketMessages,
        unsubscribeSocketMessages 
    };
    return (
        <ChatContext.Provider value={value}>
            {children}
        </ChatContext.Provider>
    )
}

export default ChatProvider;
export { ChatContext };
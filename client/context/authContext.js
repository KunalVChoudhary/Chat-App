import { createContext } from "react";
import axios from "axios";
import { io } from "socket.io-client";
import { useState, useEffect } from "react";
import {toast} from 'react-toastify';

axios.defaults.baseURL = import.meta.env.BACKEND_URL || "http://localhost:5000";

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {

    const [token,setToken] = useState(localStorage.getItem("token") || null);
    const [authUser,setAuthUser] = useState(null);
    const [onlineUsers,setOnlineUsers] = useState([]);
    const [socket,setSocket] = useState(null);

    //check if user is authenticated if yes then set the authUser and connect to socket
    const checkAuth = async () => {
        try {
            const {data} = await axios.get("/api/user/auth/check");
            if(data?.success){
                setAuthUser(data.user);
                connectSocket(data.user);
            }
        } catch (error) {
            console.log(error);
            localStorage?.removeItem("token");
        }
    };

    //Login function to handle user authentication and socket connection
    const login = async (state,credentials) => {
        try {
            const { data } = await axios.post(`/api/user/${state}`, credentials);
            if (data?.success) {
                setToken(data.token);
                setAuthUser(data.user);
                connectSocket(data.user);
                localStorage.setItem("token", data.token);
                axios.defaults.headers.common["token"] = data.token ;
             toast.success(data.message);
            }
        } catch (error) {
            console.log(error);
         toast.error(data?.message || "Some error occured");
        }
    };

    //Logout function to handle user logout and socket disconnection
    const logout = () => {
        try {
            setToken(null);
            setAuthUser(null);
            
            if(socket?.connected){
                socket.disconnect();
                setSocket(null);
            }
            localStorage.removeItem("token");
            delete axios.defaults.headers.common["token"];
         toast.success("Logged out successfully");
        } catch (error) {
            console.log(error);
         toast.error("Some error occured");
        }
    }

    //update profile function to update user profile
    const updateProfile = async (profileData) => {
        try {
            const { data } = await axios.put("/api/user/update-profile", profileData);
            if (data?.success) {
                setAuthUser(data.user);
             toast.success(data.message);
            }
        } catch (error) {
            console.log(error);
         toast.error(error?.response?.data?.message || "Some error occurred");
        }
    }


    //use socket.io to connect to the server
    const connectSocket = (user) => {
        if (!user || socket?.connected) return;
        const newSocket = io(import.meta.env.BACKEND_URL || "http://localhost:5000",{
            query: {
                userId: user._id
            }
        });
        newSocket.connect();
        setSocket(newSocket);

        newSocket.on("getOnlineUsers", (users) => {
            setOnlineUsers(users);
        });

    };

    useEffect(() => {
        if(token){
            axios.defaults.headers.common["token"] = token ;
        } 
        checkAuth();
    }, [token]);

    //cleanup function to disconnect socket when component unmounts

    useEffect(() => {
        return () => {
            if (socket?.connected) {
                socket.disconnect();
            }
        };
    }, [socket]);


    const value = {
        axios,
        token,
        setToken,
        authUser,
        setAuthUser,
        onlineUsers,
        setOnlineUsers,
        socket,
        setSocket,
        login,
        logout,
        updateProfile,
        checkAuth
    };
    return (
        <AuthContext.Provider value={value}>
            {children}
        </AuthContext.Provider>
    );
};
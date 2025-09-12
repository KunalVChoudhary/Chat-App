import { createContext, useState, useEffect } from "react";
import axios from "axios";
import { io } from "socket.io-client";
import { toast } from "react-toastify";

axios.defaults.baseURL = import.meta.env.VITE_BACKEND_URL || "http://localhost:5000";
axios.defaults.withCredentials = true;

const AuthContext = createContext(null);

const AuthProvider = ({ children }) => {
  const [token, setToken] = useState(localStorage.getItem("token") || null);
  const [authUser, setAuthUser] = useState(null);
  const [onlineUsers, setOnlineUsers] = useState([]);
  const [socket, setSocket] = useState(null);
  const [authLoading, setAuthLoading] = useState(true);

  const checkAuth = async () => {
    try {
      const { data } = await axios.get("/api/user/auth/check");
      if (data?.success) {
        setAuthUser(data.user);
        connectSocket(data.user);
      }
    } catch (error) {
      localStorage.removeItem("token");
    } finally {
      setAuthLoading(false);
    }
  };

  const login = async (state, credentials) => {
    try {
      const { data } = await axios.post(`/api/user/${state}`, credentials);
      if (data?.success) {
        setToken(data.token);
        setAuthUser(data.userData);
        connectSocket(data.userData);
        localStorage.setItem("token", data.token);
        axios.defaults.headers.common["Authorization"] = `Bearer ${data.token}`;
        toast.success(data.message);
      }
    } catch (error) {
      console.error(error);
      toast.error(error?.response?.data?.message || "Some error occurred");
    }
  };

  const logout = () => {
    try {
      setToken(null);
      setAuthUser(null);
      setAuthLoading(false);
      if (socket?.connected) {
        socket.disconnect();
        setSocket(null);
      }
      localStorage.removeItem("token");
      delete axios.defaults.headers.common["Authorization"];
      toast.success("Logged out successfully");
    } catch (error) {
      console.error(error);
      toast.error("Some error occurred");
    }
  };

  const updateProfile = async (profileData) => {
    try {
      const { data } = await axios.put("/api/user/update-profile", profileData);
      if (data?.success) {
        setAuthUser(data.userData);
        toast.success(data.message);
      }
    } catch (error) {
      console.error(error);
      toast.error(error?.response?.data?.message || "Some error occurred");
    }
  };

  const connectSocket = (user) => {
    if (!user || socket?.connected) return;
    const newSocket = io(import.meta.env.VITE_BACKEND_URL || "http://localhost:5000", {
      query: { userId: user._id },
    });
    newSocket.connect();
    setSocket(newSocket);

    newSocket.on("online-users", (users) => {
      setOnlineUsers(users);
    });
  };

  useEffect(() => {
    if (token) {
      axios.defaults.headers.common["Authorization"] = `Bearer ${token}`;
    }
    checkAuth();
  }, [token]);

  useEffect(() => {
    return () => {
      if (socket?.connected) {
        socket.disconnect();
      }
    };
  }, [socket]);

  return (
    <AuthContext.Provider
      value={{
        axios,
        token,
        setToken,
        authUser,
        setAuthUser,
        authLoading,
        onlineUsers,
        setOnlineUsers,
        socket,
        setSocket,
        login,
        logout,
        updateProfile,
        checkAuth,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export default AuthProvider;
export { AuthContext};
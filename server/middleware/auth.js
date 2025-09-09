import User from "../models/User.js";

//Middleware to protect routes
export const protectRoute = async (req, res, next) => {
    const token = req.headers.authorization?.split(" ")[1];
    if (!token) {
        return res.status(401).json({ success: false, message: "Unauthorized" });
    }
    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        const user = await User.findById(decoded.id).select("-password");

        if (!user) {
            return res.status(401).json({ success: false, message: "Unauthorized" });
        }
        req.user = user;
        next();
    } catch (error) {
        console.error(error);
        res.status(401).json({ success: false, message: error.message });
    }
};
